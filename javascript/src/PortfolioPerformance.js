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

const period = [
  { effectiveDate: new Date(2021, 8, 1, 1, 0, 0) },
  { effectiveDate: new Date(2021, 8, 2, 1, 0, 0) },
  { effectiveDate: new Date(2021, 8, 3, 1, 0, 0) },
  { effectiveDate: new Date(2021, 8, 4, 1, 0, 0) },
  { effectiveDate: new Date(2021, 8, 5, 1, 0, 0) },
  { effectiveDate: new Date(2021, 8, 6, 1, 0, 0) },
  { effectiveDate: new Date(2021, 8, 7, 1, 0, 0) },
];

function getChangesIn(list, day) {
  return list.filter((item) => item.effectiveDate.getDay() === day);
}

export function getDailyPortfolioValues() {
  const result = [];
  let lastValue = 0;
  let lastPriceKnown = prices[0].price;

  period.forEach(({ effectiveDate }) => {
    const day = effectiveDate.getDay();
    const transactionsMade = getChangesIn(transactions, day).map(
      ({ value }) => value
    );

    let changeInValueFromTransactions = 0;

    if (transactionsMade.length)
      changeInValueFromTransactions = transactionsMade.reduce(
        (sum, curr) => curr + sum
      );

    lastValue += changeInValueFromTransactions * lastPriceKnown;

    const priceChanges = getChangesIn(prices, day);

    if (priceChanges.length) {
      priceChanges.forEach(({ price }) => {
        lastValue *= price / lastPriceKnown;
        lastPriceKnown = price;
      });
    }

    result.push({ effectiveDate, value: parseFloat(lastValue.toFixed(5)) });
  });
  return result;
}
