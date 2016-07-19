

function printReceipt(tags) {
  let allItems = loadAllItems();
  let cartItems = buildCartItems(tags, allItems);
  let promotions = loadPromotions();
  let itemsSubtotal = buildReceiptItems(cartItems, promotions[0].barcode);
}
function buildCartItems(tags, allItems) {
  let cartItems = [];
  for (let tag of tags) {
    let tagArray = tag.split('-');
    let barcode = tagArray[0];
    let count = tagArray.length > 1 ? parseFloat(tagArray[1]) : 1;
    let cartItem = cartItems.find(cartItem=>barcode === cartItem.item.barcode);
    if (cartItem) {
      cartItem.count += count;
    } else {

      let allItem = allItems.find(allItem=>barcode === allItem.barcode);
      cartItems.push({item: allItem, count: count});
    }
  }
  return cartItems;
}


function buildReceiptItems(cartItems, barcodes) {
  let itemsSubtotal = [];

  for (let cartItem of cartItems) {

    let subtotal = cartItem.item.price * cartItem.count;

    if (cartItem.count > 2) {
      let tag = barcodes.find(barcode => barcode === cartItem.item.barcode);

      if (tag) {
        let saved = cartItem.item.price;
        itemsSubtotal.push({cartItem: cartItem, saved: saved, subtotal: subtotal - saved})
      }
    } else {
      itemsSubtotal.push({cartItem: cartItem, saved: 0, subtotal: subtotal})
    }
  }
  return itemsSubtotal;
}


