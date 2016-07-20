function printReceipt(tags) {
  let allItems = loadAllItems();
  let cartItems = buildCartItems(tags, allItems);
  let promotions = loadPromotions();
  let receiptItems = buildReceiptItems(cartItems, promotions);
  let receiptTotal = receiptItemsTotal(receiptItems);
  let receipt = getReceipt(receiptTotal);
  console.log(receipt);
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
  let itemsText = receiptItemsTotal.receiptItems.map(receiptItem=> {
    const cartItem = receiptItem.cartItem;
    return `名称：${cartItem.item.name}，\
数量：${cartItem.count}${cartItem.item.unit}，\
单价：${formatMoney(cartItem.item.price)}(元)，\
小计：${formatMoney(receiptItem.subtotal)}(元)`;
  }).join('\n');
  return `***<没钱赚商店>收据***
${itemsText}
----------------------
总计：${formatMoney(receiptItemsTotal.itemsTotal)}(元)
节省：${formatMoney(receiptItemsTotal.savedTotal)}(元)
**********************`;
}

function formatMoney(money) {
  return money.toFixed(2);
}

