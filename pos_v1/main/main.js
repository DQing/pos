function printReceipt(tags) {
  let allItems = loadAllItems();
  let cartItems = buildCartItems(tags, allItems);
  let promotions = loadPromotions();
  let receiptItems = buildReceiptItems(cartItems, promotions);
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

function buildReceiptItems(cartItems, promotions) {
  return cartItems.map(cartItem=> {
    let promotionType = getPromotionType(cartItem.item.barcode, promotions);
    let {saved, subtotal} = discount(cartItem, promotionType);
    return {cartItem, saved, subtotal};
  });
}
function getPromotionType(barcode, promotions) {
  let promotion = promotions.find(promotion=>promotion.barcode.includes(barcode));
  return promotion ? promotion.type : '';

}
function discount(cartItem, promotionType) {
  let freeItemCount = 0;
  if (promotionType === 'BUY_TWO_GET_ONE_FREE') {
    freeItemCount = parseInt(cartItem.count / 3);
  }
  let saved = freeItemCount * cartItem.item.price;
  let subtotal = cartItem.count * cartItem.item.price - saved;
  return {saved, subtotal}
}
