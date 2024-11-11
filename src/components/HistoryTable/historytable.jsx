
import React from "react";
import formatToVND from "../../utils/currency";

const HistoryTable = ({ data }) => {
\
  if (!data || data.length === 0) {
    return <p>Không có dữ liệu đấu giá.</p>;
  }

  return (
    <table className="history-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Name</th>
          <th>Bid</th>

        </tr>
      </thead>
      <tbody>
        {data.map((bid, index) => (
          <tr key={index}>
            <td>{new Date(bid.bidAt).toLocaleString()}</td> 
            <td>{bid.fullName}</td>
            <td>{formatToVND(bid.bidAmount)}</td>

          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HistoryTable;
