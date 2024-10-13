import { Alert, Button, DatePicker, Form, Input, InputNumber, Select, Tag, Tooltip } from "antd";
import { useForm } from "antd/es/form/Form";
import DashboardManageRequestTemplate from "../../../components/dashboard-manage-request-template";
import DashboardManageRequestTemplateForManager from "../../../components/dashboard-manage-request-manager";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

function ManagerManageAuctionRequest() {
  const title = "Auction Request";
  const [formViewDetails] = useForm();
  const [form] = useForm();
  const [formCreateAuctionSession] = useForm();
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
          <span>{dayjs(date).format("MM/DD/YYYY")}</span>
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
        if (record.status === "PENDING" || response === "") {
          return "";
        }

        const alertType =
          record.status === "ACCEPTED_BY_STAFF" || record.status === "APPROVED_BY_MANAGER"
            ? "success"
            : "error";

        const alertIcon =
          alertType === "success" ? (
            <CheckCircleOutlined style={{ color: "green", marginRight: 4 }} />
          ) : (
            <CloseCircleOutlined style={{ color: "red", marginRight: 4 }} />
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
                  borderRadius: "4px",
                  padding: "4px 8px",
                  backgroundColor: alertType === "success" ? "#f6ffed" : "#fff2f0",
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
        const checkStatus =
          s === "ACCEPTED_BY_STAFF" || s === "APPROVED_BY_MANAGER"
            ? "green"
            : s === "PENDING"
            ? "yellow"
            : "red";
        return (
          <Tag
            color={checkStatus}
            style={{
              borderRadius: "4px",
              fontWeight: "bold",
              padding: "4px 8px",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {s}
          </Tag>
        );
      },
    },
  ];
  const formViewDetailsItems = (
    <>
      <Form.Item label="Title" name="title">
        <Input disabled />
      </Form.Item>
      <Form.Item label="Created at" name="createdDate">
        <Input disabled />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input disabled />
      </Form.Item>

      <Form.Item label="Response note" name="responseNote">
        <Input style={{ color: "red" }} disabled />
      </Form.Item>
      <Form.Item hidden name="koi_id">
        <Input />
      </Form.Item>
      {/* <CardKoiFish id={formViewDetails.getFieldValue("koi_id")} /> */}
    </>
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

  const formItemsCreateAuctionSession = (
    <div>
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please enter the auction title!" }]}
      >
        <Input placeholder="Enter auction title" />
      </Form.Item>

      <Form.Item
        label="Starting Price"
        name="startingPrice"
        rules={[{ required: true, message: "Please enter a starting price!" }]}
      >
        <InputNumber min={0} placeholder="Enter starting price" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Buy Now Price"
        name="buyNowPrice"
        rules={[{ required: true, message: "Please enter a buy now price!" }]}
      >
        <InputNumber min={0} placeholder="Enter buy now price" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Bid Increment"
        name="bidIncrement"
        rules={[{ required: true, message: "Please enter bid increment!" }]}
      >
        <InputNumber min={1} placeholder="Enter bid increment" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Start Date"
        name="startDate"
        rules={[{ required: true, message: "Please select the start date!" }]}
      >
        <DatePicker showTime style={{ width: "100%" }} placeholder="Select start date" />
      </Form.Item>

      <Form.Item
        label="End Date"
        name="endDate"
        rules={[{ required: true, message: "Please select the end date!" }]}
      >
        <DatePicker showTime style={{ width: "100%" }} placeholder="Select end date" />
      </Form.Item>

      <Form.Item
        label="Auction Type"
        name="auctionType"
        rules={[{ required: true, message: "Please select auction type!" }]}
      >
        <Select placeholder="Select auction type">
          <Select.Option value="ASCENDING">Ascending</Select.Option>
          <Select.Option value="DESCENDING">Descending</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Minimum Balance to Join"
        name="minBalanceToJoin"
        rules={[
          {
            required: true,
            message: "Please enter the minimum balance required to join!",
          },
        ]}
      >
        <InputNumber min={0} placeholder="Enter minimum balance" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Auction Request ID"
        name="auction_request_id"
        rules={[
          {
            required: true,
            message: "Please enter the auction request ID!",
          },
        ]}
      >
        <InputNumber min={0} placeholder="Enter auction request ID" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Staff ID"
        name="staff_id"
        rules={[
          {
            required: true,
            message: "Please enter the staff ID!",
          },
        ]}
      >
        <InputNumber min={0} placeholder="Enter staff ID" style={{ width: "100%" }} />
      </Form.Item>
    </div>
  );

  return (
    <div style={{ margin: "100px auto" }}>
      <DashboardManageRequestTemplateForManager
        // isRerender={hongthinh}
        apiUriPOST="auctionRequest"
        // formItems={formItems}
        title={title}
        columns={columns}
        dateFields={"createdDate"}
        keyField={"auction_request_id"}
        formViewDetailsItem={formViewDetailsItems}
        isIncludeImage={false}
        apiURI={"auctionRequest"}
        formViewDetails={formViewDetails}
        isShownCardKoiFish={true}
        form={form}
        formItems={formItems}
        apiUriPUT={"auctionRequest/approve"}
        apiUriDelete={"auctionRequest/reject"}
        formCreateAuctionSession={formCreateAuctionSession}
        formItemsCreateAuctionSession={formItemsCreateAuctionSession}
      />
    </div>
  );
}

export default ManagerManageAuctionRequest;
