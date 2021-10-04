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

  sortListBy(pricesAndTransactionsList, "effectiveDate");

  const portfolioValues = {};
  let lastPriceKnown = 0;

  pricesAndTransactionsList.forEach(({ effectiveDate, price, value }) => {
    if (price && !lastPriceKnown) lastPriceKnown = price;
    resetHoursInDate(effectiveDate);

    let currentPortfolioValue = getCurrentPortfolioValue(
      portfolioValues,
      effectiveDate
    );

    let newPortofolioValue;

    if (price) {
      newPortofolioValue = getValueAfterPriceChange(
        currentPortfolioValue,
        price,
        lastPriceKnown
      );
      lastPriceKnown = price;
    }

    if (value)
      newPortofolioValue = getValueAfterTransaction(
        currentPortfolioValue,
        value,
        lastPriceKnown
      );

    if (!newPortofolioValue) return;

    portfolioValues[effectiveDate] = {
      effectiveDate: effectiveDate,
      value: formatFloatNumber(newPortofolioValue, 5),
    };
    return;
  });

  return Object.values(portfolioValues);
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
  return (date = new Date(date.setHours(1, 0, 0, 0)));
}

// console.log(getDailyPortfolioValues());
