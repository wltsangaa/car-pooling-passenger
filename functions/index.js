const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp(functions.config().firebase);





// https://us-central1-cab-dashboard.cloudfunctions.net/getDriver
exports.getDriver = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    let driverArray = [];
    let data = req.body; // {origin: {}, destination: {}, uid: }
    res.setHeader('Access-Control-Allow-Origin', '*');
    admin
      .firestore()
      .collection("drivers")
      .get()
      .then(querySnapshots => {
        querySnapshots.forEach(doc => {
          if (
            doc.data().email === 'pologood123@connect.ust.hk' // You can add a logic to pick driver here, with some algorithm you have
          ) {
            let obj = doc.data();
            obj["id"] = doc.id;
            driverArray.push(obj);
          }
        });
        if (driverArray.length) {
          let item = driverArray[0];
          console.log(item);
          // update customer document
          admin
            .firestore()
            .collection("customers")
            .doc(data.uid)
            .update({
              origin: data.origin,
              destination: data.destination,
              rejectRide: false,
              rideOn: false,
              ignoreRide: false
            })// update driver document
            .then(() => {
              admin
                .firestore()
                .collection("drivers")
                .doc(item.id)
                .update({
                  requestRide: true,
                  requestedUser: data.uid
                }).then(() => {
                  res.send(item);
                })
            })
        } else {
          res.send({ status: 'error' });
        }
      });
  });
});

// https://us-central1-cab-dashboard.cloudfunctions.net/rejectRide
exports.rejectRide = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    let uid = req.body.userid;
    let custId = req.body.custId;
    res.setHeader('Access-Control-Allow-Origin', '*');
    admin
      .firestore()
      .collection("drivers")
      .doc(uid)
      .update({
        requestRide: false,
        requestedUser: admin.firestore.FieldValue.delete()
      })
      .then(() => {

        admin
          .firestore()
          .collection("customers")
          .doc(custId)
          .update({
            rejectRide: true,
            rideOn: false
          })
          .then(doc => {
            res.send({ status: 'done' });
          });
      })
      .catch((err) => {
        res.send({ status: 'error', message: err });
      });
  });
});

// https://us-central1-cab-dashboard.cloudfunctions.net/acceptRide
exports.acceptRide = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    let uid = req.body.custId;
    res.setHeader('Access-Control-Allow-Origin', '*');

    // get user info
    admin
      .firestore()
      .collection("customers")
      .doc(uid)
      .update({
        rideOn: true
      })
      .then(() => {
        admin
          .firestore()
          .collection("customers")
          .doc(uid)
          .get()
          .then(doc => {
            res.send(doc.data());
          });
      })
      .catch((err) => {
        res.send({ status: 'error', message: err });
      });
  });
});

exports.drivernotRespond = functions.https.onRequest((req, res) => {
  cors(req, res, () => {

    let driverArray = [];
    let data = req.body;
    console.log('data', data);
    res.setHeader('Access-Control-Allow-Origin', '*');
    admin
      .firestore()
      .collection("drivers")
      .get()
      .then(querySnapshots => {
        querySnapshots.forEach(doc => {
          console.log('doc', doc.data());
          if (
            doc.data().email === 'pologood123@connect.ust.hk'
          ) {
            let obj = doc.data();
            obj["id"] = doc.id;
            driverArray.push(obj);
          }
        });
        console.log('driverArray', driverArray);
        if (driverArray.length) {
          let item = driverArray[0];
          // update customer document
          console.log('item', item);
          admin
            .firestore()
            .collection("customers")
            .doc(data.uid)
            .update({
              rejectRide: false,
              ignoreRide: true,
              rideOn: false
            }).then(() => {
              console.log('customers data updated on ignore');
              admin
                .firestore()
                .collection("drivers")
                .doc(item.id)
                .update({
                  requestRide: false,
                  requestedUser: admin.firestore.FieldValue.delete()
                }).then(() => {
                  console.log('driver data updated on ignore');
                  res.send({ status: 'ignored' });
                })
            })
        } else {
          res.send({ status: 'error' });
        }
      });
  });
});

// https://us-central1-cab-dashboard.cloudfunctions.net/completeRide
exports.completeRide = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    let driver = req.body.driverId;
    let customer = req.body.custId;
    let user = req.body.custData;
    let date = req.body.date;
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (!date) {
      date = admin.firestore.Timestamp.fromDate(new Date());
    }
    // update driver
    admin
      .firestore()
      .collection("drivers")
      .doc(driver)
      .update({
        requestRide: false,
        requestedUser: null
      }).then((data) => {
        console.log('driver updated after ride completion');
        console.log(data);
      }).catch((e) => {
        console.log(e);
      });

    // update customer
    admin
      .firestore()
      .collection("customers")
      .doc(customer)
      .update({
        rideOn: false,
        origin: null,
        destination: null
      })
      .then((data) => {
        console.log('customer updated after ride completion');
        console.log(data);
        admin
          .firestore()
          .collection("completedRides")
          .add({
            driver: driver,
            customer: customer,
            fare: 50,
            origin: user.origin,
            destination: user.destination,
            date: date
          })
          .then((ride) => {
            console.log('completedRides updated after ride completion');
            console.log(ride);
            res.send({ status: 'done' });
          })
          .catch(err => {
            res.send({status:'error', message: err});
          });
      }).catch((e) => {
        console.log(e);
      });
  });
});
