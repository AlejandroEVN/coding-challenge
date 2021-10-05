const prices = [
  { effectiveDate: new Date(2021, 8, 1, 5, 0, 0), price: 35464.53 },
  { effectiveDate: new Date(2021, 8, 2, 5, 0, 0), price: 35658.76 },
  { effectiveDate: new Date(2021, 8, 3, 5, 0, 0), price: 36080.06 },
  { effectiveDate: new Date(2021, 8, 3, 13, 0, 0), price: 37111.11 },
  { effectiveDate: new Date(2021, 8, 6, 5, 0, 0), price: 38041.47 },
  { effectiveDate: new Date(2021, 8, 7, 5, 0, 0), price: 34029.61 },
];

const transactions = [
  { effectiveDate: new Date(2021, 8, 1, 9, 0, 0), value: 0.012 },
  { effectiveDate: new Date(2021, 8, 1, 15, 0, 0), value: -0.007 },
  { effectiveDate: new Date(2021, 8, 4, 9, 0, 0), value: 0.017 },
  { effectiveDate: new Date(2021, 8, 5, 9, 0, 0), value: -0.01 },
  { effectiveDate: new Date(2021, 8, 7, 9, 0, 0), value: 0.1 },
];

export function getDailyPortfolioValues() {
  const pricesAndTransactionsList = getMergedList(prices, transactions);

  if (pricesAndTransactionsList.length === 0) return [];

  sortListBy(pricesAndTransactionsList, "effectiveDate");

  const portfolioDailyValues = {};
  let lastPriceKnown = 0;

  pricesAndTransactionsList.forEach(({ effectiveDate, price, value }) => {
    if (!price && !value) throw new Error("Invalid data");
    if (price && !lastPriceKnown) lastPriceKnown = price;

    const newDate = resetHoursInDate(effectiveDate);

    const currentPortfolioValue = getCurrentPortfolioValue(
      portfolioDailyValues,
      newDate
    );

    let newPortofolioValue = 0;
    let operation;

    if (price) operation = getValueAfterPriceChange;

    if (value) operation = getValueAfterTransaction;

    newPortofolioValue = operation(
      currentPortfolioValue,
      price || value,
      lastPriceKnown
    );

    lastPriceKnown = price || lastPriceKnown;

    if (!newPortofolioValue) return;

    return insertNewValueInPortfolio(
      portfolioDailyValues,
      newDate,
      newPortofolioValue
    );
  });

  return Object.values(portfolioDailyValues);
}

function getMergedList(list1, list2) {
  return [...list1, ...list2];
}

function sortListBy(list, attribute) {
  return list.sort((a, b) => a[attribute] - b[attribute]);
}

function formatFloatNumber(value, decimals) {
  return parseFloat(value.toFixed(decimals));
}

function getCurrentPortfolioValue(portfolio, date) {
  if (portfolio[date]) return portfolio[date].value;
  const lastEntry = Object.keys(portfolio).pop();
  return portfolio[lastEntry]?.value || 0;
}

function getValueAfterPriceChange(portfolioValue, currentPrice, previousPrice) {
  return (portfolioValue * currentPrice) / previousPrice;
}

function getValueAfterTransaction(portfolioValue, transactionValue, price) {
  return portfolioValue + transactionValue * price;
}

function resetHoursInDate(date) {
  return new Date(date.setHours(1, 0, 0, 0));
}

function insertNewValueInPortfolio(portfolio, newDate, newValue) {
  return (portfolio[newDate] = {
    effectiveDate: newDate,
    value: formatFloatNumber(newValue, 5),
  });
}
