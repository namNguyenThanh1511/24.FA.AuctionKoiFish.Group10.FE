// src/components/HistoryTable.jsx
import React from 'react';

const HistoryTable = ({ data }) => {
  // Kiểm tra nếu không có dữ liệu
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
          {/* Thêm các cột khác nếu cần */}
        </tr>
      </thead>
      <tbody>
        {data.map((bid, index) => (
          <tr key={index}>
            <td>{new Date(bid.bidAt).toLocaleString()}</td> {/* Chuyển đổi thời gian nếu cần */}
            <td>{bid.fullName}</td>
            <td>{bid.bidAmount}</td>
            {/* Thêm các ô khác nếu cần */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HistoryTable;
