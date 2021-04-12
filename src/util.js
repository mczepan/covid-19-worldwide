export const sortData = (data) => {
  const sortedData = [...data];

  sortedData.sort((a, b) => parseInt(b.cases) - parseInt(a.cases));
  return sortedData;
};
