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

function getMergedList(list1, list2) {
  return [...list1, ...list2];
}

function sortListBy(attribute, list) {
  return list.sort((a, b) => a[attribute] - b[attribute]);
}

function stringifyDate(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function getDailyPortfolioValues() {
  const mergedList = getMergedList(prices, transactions);

  sortListBy("effectiveDate", mergedList);

  const portfolioValues = [];
  let currentIndex = 0;
  let currentValue = 0;
  let lastPriceKnown = 0;
  let lastDateChecked = "";

  mergedList.forEach(({ effectiveDate, price, value }) => {
    if (!lastDateChecked) lastDateChecked = stringifyDate(effectiveDate);

    if (stringifyDate(effectiveDate) !== lastDateChecked) {
      lastDateChecked = stringifyDate(effectiveDate);
      currentIndex++;
    }

    if (!lastPriceKnown) lastPriceKnown = price;

    if (price) {
      currentValue *= price / lastPriceKnown;
      lastPriceKnown = price;
    }

    if (value) {
      currentValue += value * lastPriceKnown;
    }

    if (!currentValue) return;

    portfolioValues[currentIndex] = {
      effectiveDate: new Date(
        effectiveDate.getFullYear(),
        effectiveDate.getMonth(),
        effectiveDate.getDate(),
        1
      ),
      value: parseFloat(currentValue.toFixed(5)),
    };
  });
  return portfolioValues;
}
