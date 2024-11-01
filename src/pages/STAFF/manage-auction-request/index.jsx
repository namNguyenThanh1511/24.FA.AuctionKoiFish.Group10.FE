import { Alert, Button, Card, DatePicker, Form, Input, Select, Tag, Tooltip } from "antd";
import { useForm } from "antd/es/form/Form";
import DashboardManageRequestTemplate from "../../../components/dashboard-manage-request-template";
import { CheckCircleOutlined, CloseCircleOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import BasicFilter from "../../../components/basic-filter";

function ManageAuctionRequest() {
  const title = "Auction Request";
  const [formViewDetails] = useForm();
  const [form] = useForm();
  const [filters, setFilters] = useState({
    statusEnumList: null,
    breederUsernameList: null,
  });
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Created at",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => (
        <Tooltip title={dayjs(date).format("MMMM D, YYYY, h:mm A")}>
          <span>{dayjs(date).format("YYYY-MM-DD")}</span>
        </Tooltip>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Breeder",
      dataIndex: "breeder",
      key: "breeder",
      render: (breeder) => {
        return breeder.username;
      },
    },
    {
      title: "Response Note",
      dataIndex: "responseNote",
      key: "responseNote",
      render: (response, record) => {
        // If status is pending or response is empty, return an empty string
        if (record.status === "PENDING" || response === "" || response === null) {
          return null;
        }

        // Determine alert type based on the record status
        const alertType =
          record.status === "ACCEPTED_BY_STAFF" || record.status === "APPROVED_BY_MANAGER"
            ? "success"
            : "error";

        // Determine the icon to show based on alert type
        const alertIcon =
          alertType === "success" ? (
            <CheckCircleOutlined style={{ color: "green" }} />
          ) : (
            <CloseCircleOutlined style={{ color: "red" }} />
          );

        return (
          <Tooltip title={response} placement="top">
            <span style={{ display: "flex", alignItems: "center" }}>
              {alertIcon}
              <Alert
                message={response}
                type={alertType}
                showIcon
                style={{
                  marginLeft: 8,
                  border: "none",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
                closable
              />
            </span>
          </Tooltip>
        );
      },
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => {
        let color;
        switch (s) {
          case "ACCEPTED_BY_STAFF":
            color = "blue";
            break;
          case "APPROVED_BY_MANAGER":
            color = "green";
            break;
          case "PENDING":
            color = "yellow";
            break;
          default:
            color = "red";
        }
        return <Tag color={color}>{s}</Tag>;
      },
    },
  ];
  const formViewDetailsItems = (
    <Card
      style={{
        width: "100%",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Enhanced shadow for depth
        marginBottom: "20px",
        backgroundColor: "#f9f9f9", // Light background for better contrast
      }}
      bordered={false}
    >
      <Form.Item name={"title"}>
        <Input
          style={{
            fontSize: "24px", // Adjust the font size
            fontWeight: "bold", // Make it bold
            color: "red", // Set the text color
            border: "none", // Remove the border
            backgroundColor: "transparent", // Make background transparent
            textAlign: "center", // Center align text (optional)
            padding: 0, // Remove default padding
            margin: 0, // Remove default margin
            pointerEvents: "none",
          }}
          readOnly // Optional: Make it read-only if you don't want it editable
        />
      </Form.Item>
      <Form.Item name={"createdDate"}>
        <DatePicker
          style={{
            border: "none", // Remove border
            backgroundColor: "transparent", // Transparent background
            cursor: "pointer", // Change cursor to pointer
            padding: "10px", // Add some padding
            borderRadius: "4px", // Rounded corners
            display: "flex", // Flex display to align items
            alignItems: "center", // Center align items vertically
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Light shadow for depth
            pointerEvents: "none",
          }}
          readOnly
          dropdownStyle={{
            display: "none",
          }}
          format="YYYY-MM-DD"
        />
      </Form.Item>

      <Form.Item label="Description : " name="description">
        <TextArea
          rows={4} // Adjust the number of rows
          value={formViewDetails.getFieldValue("description") || "No description available."}
          style={{
            margin: 0,
            color: "#333",
            lineHeight: "1.5",
            resize: "none", // Prevents resizing the TextArea
            border: "1px solid #d9d9d9", // Optional: custom border style
            borderRadius: "4px", // Optional: rounded corners
            padding: "8px", // Padding for inner content
            backgroundColor: "#f9f9f9", // Light background for contrast
            cursor: "pointer",
          }}
          readOnly // Optional: Make it read-only
        />
      </Form.Item>

      <Form.Item label="Response note" name="responseNote">
        <TextArea
          rows={4} // Adjust the number of rows
          value={formViewDetails.getFieldValue("responseNote") || "No response note available."}
          style={{
            margin: 0,
            color: "red",
            fontWeight: "500",
            lineHeight: "1.5",
            resize: "none", // Prevents resizing the TextArea
            border: "1px solid #d9d9d9", // Optional: custom border style
            borderRadius: "4px", // Optional: rounded corners
            padding: "8px", // Padding for inner content
            backgroundColor: "#f9f9f9", // Light background for contrast
            cursor: "pointer",
          }}
          readOnly // Optional: Make it read-only
        />
      </Form.Item>

      <Form.Item hidden name="koi_id">
        <Input value={formViewDetails.getFieldValue("koi_id")} />
      </Form.Item>
      {/* <CardKoiFish id={formViewDetails.getFieldValue("koi_id")} /> */}
    </Card>
  );

  const formItems = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
      }}
    >
      <div>
        <Form.Item label="Response Note" name="responseNote">
          <Input placeholder="Enter response note" />
        </Form.Item>
      </div>
    </div>
  );
  const onChangeFilter = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    console.log(updatedFilters);
  };
  const statusOptions = [
    { value: "PENDING", color: "orange" },
    { value: "ACCEPTED_BY_STAFF", color: "blue" },
    { value: "APPROVED_BY_MANAGER", color: "green" },
    { value: "REJECTED_BY_MANAGER", color: "red" },
    { value: "REJECTED_BY_STAFF", color: "red" },
  ];
  const filterItems = (
    <div
      style={{
        display: "flex",
        gap: "16px",
        marginBottom: "16px",
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: "#f0f2f5",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Form.Item name="breederUsernameList" label="Koi Breeder's username" style={{ flex: 1 }}>
        <Input
          onChange={(e) => onChangeFilter("breederUsernameList", e.target.value)}
          placeholder="Search by username"
          prefix={<SearchOutlined />} // Add an icon
          style={{ borderRadius: "4px" }}
        />
      </Form.Item>
      <Form.Item name="statusEnumList" label="Status" style={{ flex: 1 }}>
        <Select
          onChange={(value) => onChangeFilter("statusEnumList", value)}
          placeholder="Select status"
          allowClear
          style={{ borderRadius: "4px" }}
        >
          {statusOptions.map(({ value, color }) => (
            <Select.Option key={value} value={value}>
              <Tag color={color} style={{ marginRight: "8px" }}>
                {value}
              </Tag>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  );

  return (
    <div style={{ margin: "100px auto" }}>
      <BasicFilter filterItems={filterItems} />
      {/* <div>{filterItems}</div> */}
      <DashboardManageRequestTemplate
        // isRerender={hongthinh}
        apiUriPOST="auctionRequest"
        // formItems={formItems}
        title={title}
        columns={columns}
        dateFields={"createdDate"}
        keyField={"auction_request_id"}
        formViewDetailsItem={formViewDetailsItems}
        isIncludeImage={false}
        apiURI={"auctionRequest/staff-only/pagination/filter"}
        formViewDetails={formViewDetails}
        isShownCardKoiFish={true}
        form={form}
        formItems={formItems}
        apiUriPUT={"auctionRequest/approve"}
        apiUriDelete={"auctionRequest/reject"}
        paginationTarget={"auctionRequestResponseList"}
        filterParams={filters}
      />
    </div>
  );
}

export default ManageAuctionRequest;
