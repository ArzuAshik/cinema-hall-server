module.exports = function(email, movieTitle, showDate, time, selectedSeats){
  let seatNames = "";
  for(element of selectedSeats){
    seatNames += seatName(element);
  }
  const currentDate = new Date();
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cinema Ticket Invoice</title>
    <style>
      h1 {
        text-align: center;
        font-size: 3em;
      }
      table {
        font-size: 1.5em;
        margin: 0 auto;
      }
      th {
        text-align: left;
        min-width: 300px;
        padding: 10px 0;
      }
      span {
        background-color: gray;
        color: #fafafa;
        padding: 0 5px;
        border-radius: 3px;
        margin: 0 5px;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>Cinema Ticket Invoice</h1>
    </header>
    <table>
      <tr>
        <th>Email:</th>
        <td>${email}</td>
      </tr>
      <tr>
        <th>Movie Name:</th>
        <td>${movieTitle}</td>
      </tr>
      <tr>
        <th>Booking Date:</th>
        <td>${currentDate.toDateString()}</td>
      </tr>
      <tr>
        <th>Show Date:</th>
        <td>${showDate}</td>
      </tr>
      <tr>
        <th>Show Time:</th>
        <td>${time}</td>
      </tr>
      <tr>
        <th>Total Booked Ticket:</th>
        <td>${selectedSeats.length}</td>
      </tr>
      <tr>
        <th>Seat Numbers:</th>
        <td>${seatNames}</td>
      </tr>
      <tr>
        <th>Price:</th>
        <td>${selectedSeats.length * 500}</td>
      </tr>
    </table>
  </body>
</html>
`
}

function seatName(index){
  if(index < 10){
      return "<span>A" + (index + 1)+"</span>";
  } else if(index < 20){
      return "<span>B" + (index - 9)+"</span>";
  }else if(index < 30){
      return "<span>C" + (index - 19)+"</span>";
  } else{
      return "<span>D" + (index - 29)+"</span>";
  }
}