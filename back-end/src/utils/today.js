function today() {
  const d = new Date();
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  let year = d.getFullYear();
  console.log(d, month, day, year);

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

module.exports = today;
