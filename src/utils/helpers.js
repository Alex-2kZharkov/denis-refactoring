const { db } = require("../configs/firebase");
const pushToFireBase = async (productsArray) => {
  // using modern syntax
  const productsDb = db.collection("StoresToLaptops"); // delete 'coll' variable before cycle
  for (const product of productsArray) {
    const coll = productsDb.doc(uuid.v1());
    await coll.set({
      Store: product.store,
      Product: product.productName,
      Link: product.productLink,
    });
  }
};

module.exports = {
  pushToFireBase,
};
