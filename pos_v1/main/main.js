function printReceipt(tags) {
  let allItems = loadAllItems();
  let cartItems = buildCartItems(tags, allItems);
  let promotions = loadPromotions();
  let receiptItems = buildReceiptItems(cartItems, promotions);
  let receiptItemsTotal = receiptItemsTotal(receiptItems);
  //let receipt = getReceipt(receiptItemsTotal);
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
  if (promotionType) {
    freeItemCount = parseInt(cartItem.count / 3);
  }
  let saved = freeItemCount * cartItem.item.price;
  let subtotal = cartItem.item.price * cartItem.count - saved;
  return {saved, subtotal};
}
function receiptItemsTotal(receiptItems) {

  let [savedTotal,itemsTotal]=[0, 0];
  for (let receiptItem of receiptItems) {
    savedTotal += receiptItem.saved;
    itemsTotal += receiptItem.subtotal;
  }
  return {receiptItems, savedTotal, itemsTotal};

}

function getReceipt(receiptItemsTotal) {
  let receipt;
  let title = '***<没钱赚商店>收据***' + '\n';
  let middle = '----------------------' + '\n';
  let bottom = '**********************';
  let itemsReceipt = '';
  let receiptItems = receiptItemsTotal.receiptItems;
  for (let receiptItem of receiptItems) {

    itemsReceipt += '名称：' + receiptItem.cartItem.item.name + '，数量：' + receiptItem.cartItem.count + receiptItem.cartItem.item.unit + '，单价：' + (receiptItem.cartItem.item.price).toFixed(2) + '(元)，' + '小计：' + (receiptItem.subtotal).toFixed(2) + '(元)' + '\n';
  }
  receipt = title + itemsReceipt + middle + '总计：' + (receiptItemsTotal.itemsTotal).toFixed(2) + '(元)' + '\n' + '节省：' + (receiptItemsTotal.savedTotal).toFixed(2) + '(元)\n' + bottom;
  return receipt;
}


