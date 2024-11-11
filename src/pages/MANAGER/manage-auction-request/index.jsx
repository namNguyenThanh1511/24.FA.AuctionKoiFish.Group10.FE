import {
  Alert,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { useForm } from "antd/es/form/Form";
import DashboardManageRequestTemplate from "../../../components/dashboard-manage-request-template";
import DashboardManageRequestTemplateForManager from "../../../components/dashboard-manage-request-manager";
import { CheckCircleOutlined, CloseCircleOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import BasicFilter from "../../../components/basic-filter";
import { useEffect, useState } from "react";
import api from "../../../config/axios";

function ManagerManageAuctionRequest() {
  const title = "Auction Request";
  const [formViewDetails] = useForm();
  const [form] = useForm();
  const [formCreateAuctionSession] = useForm();
  const [staffList, setStaffList] = useState([]);
  const [isStaffModalVisible, setIsStaffModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isBidIncrementDisabled, setBidIncrementDisabled] = useState(false);
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
        if (record.status === "PENDING" || response === "" || response === null) {
          return null;
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
        const statusColorMap = {
          ACCEPTED_BY_STAFF: "blue",
          APPROVED_BY_MANAGER: "green",
          PENDING: "yellow",
          REJECTED: "red",
          CANCELLED: "pink",
        };

        // Get the color for the current status, or fallback to a default color
        const checkStatus = statusColorMap[s] || "gray";

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

  const staffColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Username", dataIndex: "username", key: "username" },
    {
      title: "Action",
      key: "action",
      render: (_, staff) => (
        <Button type="link" onClick={() => handleStaffSelect(staff)}>
          Select
        </Button>
      ),
    },
  ];

  const handleOpenStaffModal = () => {
    setIsStaffModalVisible(true);
  };

  const handleCloseStaffModal = () => {
    setIsStaffModalVisible(false);
  };

  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff);
    console.log(staff);
    formCreateAuctionSession.setFieldsValue({ staff_id: staff.id }); // Set the selected staff ID in the form
    console.log(formCreateAuctionSession.getFieldValue("staff_id"));
    setIsStaffModalVisible(false);
  };

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
        rules={[
          { required: true, message: "Please enter a buy now price!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || value > getFieldValue("startingPrice")) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Buy now price must be greater than starting price"));
            },
          }),
        ]}
      >
        <InputNumber min={0} placeholder="Enter buy now price" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Bid Increment"
        name="bidIncrement"
        rules={[{ required: true, message: "Please enter bid increment!" }]}
      >
        <InputNumber
          min={0}
          placeholder="Enter bid increment"
          style={{ width: "100%" }}
          disabled={isBidIncrementDisabled}
        />
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
        <Select
          placeholder="Select auction type"
          onChange={(value) => {
            if (value === "FIXED_PRICE") {
              formCreateAuctionSession.setFieldsValue({ bidIncrement: 0 });
              setBidIncrementDisabled(true);
            } else {
              setBidIncrementDisabled(false);
            }
          }}
        >
          <Select.Option value="ASCENDING">Ascending</Select.Option>
          <Select.Option value="FIXED_PRICE">Fixed price</Select.Option>
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
      <Form.Item hidden name="auction_request_id">
        <InputNumber />
      </Form.Item>
      <Form.Item label="Staff" name="staff_id">
        {selectedStaff ? (
          <Card
            actions={[
              <Button danger key={1} type="default" onClick={() => setSelectedStaff(null)}>
                Remove
              </Button>,
            ]}
          >
            <div>
              <p>
                <strong>ID:</strong> {selectedStaff.id}
              </p>
              <p>
                <strong>Username:</strong> {selectedStaff.username}
              </p>
            </div>
          </Card>
        ) : (
          <Button onClick={handleOpenStaffModal}>Assign Staff</Button>
        )}
      </Form.Item>

      <Modal
        title="Assign staff"
        open={isStaffModalVisible}
        onCancel={() => handleCloseStaffModal()}
        footer={null}
      >
        <Table
          dataSource={staffList}
          columns={staffColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Modal>
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

  const fetchStaffs = async () => {
    try {
      const response = await api.get("staffs");
      setStaffList(response.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };
  useEffect(() => {
    fetchStaffs();
  }, []);

  return (
    <div style={{ margin: "100px auto" }}>
      <BasicFilter filterItems={filterItems} />

      <DashboardManageRequestTemplateForManager
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
        formCreateAuctionSession={formCreateAuctionSession}
        formItemsCreateAuctionSession={formItemsCreateAuctionSession}
        paginationTarget={"auctionRequestResponseList"}
        filterParams={filters}
        setSelectedStaff={setSelectedStaff}
        setBidIncrementDisabled={setBidIncrementDisabled}
      />
    </div>
  );
}

export default ManagerManageAuctionRequest;
