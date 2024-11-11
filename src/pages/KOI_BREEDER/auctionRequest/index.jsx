import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  message,
  Image,
  Radio,
  Modal,
  Switch,
  Tag,
  Alert,
  Table,
  Card,
  Row,
  Tooltip,
  Descriptions,
} from "antd";
import DashboardTemplate from "../../../components/dashboard-manage-template";
import dayjs from "dayjs";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import formatToVND from "../../../utils/currency";
import { useForm } from "antd/es/form/Form";
import CardKoiFish from "../../../components/card-koi-fish";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import TextArea from "antd/es/input/TextArea";
import BasicFilter from "../../../components/basic-filter";

function ManageAuctionRequestOfKoiBreeder() {
  const title = "Auction Request";
  const [varieties, setVarieties] = useState([]);
  const [health, setHealth] = useState();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [render, setRender] = useState(false);
  const [fishList, setFishList] = useState([]); // State to hold fetched fish
  const [selectedFish, setSelectedFish] = useState(null); // State for the selected fish

  const [form] = useForm();
  const [formViewDetails] = useForm();
  const [filters, setFilters] = useState({
    status: null,
    startDate: null,
    endDate: null,
  });
  const koiColumns = [
    {
      title: "Image",
      dataIndex: "image_url",
      key: "image_url",
      render: (image_url) => (
        <>
          <Image width={200} src={image_url} />
        </>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Sex",
      dataIndex: "sex",
      key: "sex",
    },
    {
      title: "Size (cm)",
      dataIndex: "sizeCm",
      key: "sizeCm",
      render: (size) => (
        <Tooltip title={`Size: ${size} cm`}>
          <span>{size} cm</span>
        </Tooltip>
      ),
    },
    {
      title: "Weight (kg)",
      dataIndex: "weightKg",
      key: "weightKg",
      render: (weight) => (
        <Tooltip title={`Weight: ${weight} kg`}>
          <span>{weight} kg</span>
        </Tooltip>
      ),
    },

    {
      title: "Estimated Value",
      dataIndex: "estimatedValue",
      key: "estimatedValue",
      render: (value) => <span>{formatToVND(value)}</span>,
    },

    {
      title: "Action",
      key: "action",
      render: (_, fish) => <Button onClick={() => handleFishSelect(fish)}>Select</Button>,
    },
  ];
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <Tooltip title={text}>
          <span style={{ fontWeight: "bold" }}>{text}</span>
        </Tooltip>
      ),
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
      render: (text) => (
        <Tooltip title={text}>
          <span
            style={{
              maxWidth: "200px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
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
      render: (status) => {
        let color;
        switch (status) {
          case "ACCEPTED_BY_STAFF":
            color = "blue"; // Set to blue for "ACCEPTED_BY_STAFF"
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
        return (
          <Tooltip title={status}>
            <Tag color={color} style={{ cursor: "pointer" }}>
              {status}
            </Tag>
          </Tooltip>
        );
      },
    },
  ];

  const fetchVarieties = async () => {
    try {
      const response = await api.get("variety/all");
      setVarieties(response.data);
    } catch (error) {
      toast.error(error);
    }
  };

  // Fetch fish data
  const fetchFish = async () => {
    try {
      const response = await api.get("koiFish/koiBreeder/available");
      setFishList(response.data);
    } catch (error) {
      toast.error(error);
    }
  };

  const statusColors = {
    AVAILABLE: "green",
    PENDING: "yellow",
    PENDING_AUCTION: "orange",
    SELLING: "purple",
    DELIVER_REQUIRED: "red",
    DELIVERING_TO_BUYER: "teal",
    RETURNING: "brown",
    SOLD: "blue",
    UNAVAILABLE: "gray",
  };

  useEffect(() => {
    fetchVarieties();
    fetchFish(); // Fetch fish data when component mounts
  }, []);

  const handleFishSelect = (fish) => {
    setSelectedFish(fish); // Set the selected fish
    setIsOpenModal(false); // Close the modal
    form.setFieldsValue({
      koiFish_id: fish?.koi_id, //when create new auction request
    });
  };

  const props = {
    name: "file",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        // message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  const formatDate = (dateValue) => {
    const date = new Date(dateValue);
    return !isNaN(date.getTime()) ? date.toLocaleDateString() : "N/A";
  };

  const formItems = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
      }}
    >
      <div>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter the title!" }]}
        >
          <Input placeholder="Enter title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter description!" }]}
        >
          <Input placeholder="Enter description" />
        </Form.Item>
        <div
          style={{
            width: "100%",
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            style={{ textAlign: "center" }}
            onClick={() => {
              setIsOpenModal(true);
              fetchFish();
            }}
          >
            Select Fish
          </Button>
        </div>
        <Form.Item hidden label="Koi Fish" name={"koiFish_id"}>
          <Input value={selectedFish?.koi_id} />
        </Form.Item>
      </div>

      {selectedFish && (
        <Card
          style={{ width: 300, marginTop: 16 }}
          actions={[
            <Button danger key={1} type="default" onClick={() => setSelectedFish(null)}>
              Remove
            </Button>,
          ]}
        >
          <div style={{ textAlign: "center" }}>
            <Image width={100} src={selectedFish.image_url} />
            <div style={{ marginTop: 16 }}>
              <Tag color="geekblue">{selectedFish.name}</Tag>
              <Tag color="volcano">{selectedFish.sex}</Tag>
            </div>
            <p style={{ marginTop: 8 }}>
              <strong>Koi ID :</strong> {selectedFish.name + "#" + selectedFish.koi_id}
            </p>
            <p>
              <strong>Size:</strong> {selectedFish?.sizeCm} cm
            </p>
            <p>
              <strong>Weight:</strong> {selectedFish?.weightKg} kg
            </p>
            <p>
              <strong>Born In:</strong> {dayjs(selectedFish?.bornIn).format("YYYY-MM-DD")}
            </p>
            <p>
              <strong>Description:</strong> {selectedFish?.description}
            </p>
            <p>
              <strong>Estimated Value:</strong> {formatToVND(selectedFish?.estimatedValue)}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Tag color={statusColors[selectedFish?.koiStatus]}>{selectedFish?.koiStatus}</Tag>
            </p>
            <span>
              <strong>Varieties :</strong>{" "}
            </span>
            {/* Display Koi Varieties as Tags */}
            {selectedFish?.varieties?.map((variety, id) => {
              // Define a color map or generate a color based on variety
              const varietyColorMap = {
                Kohaku: "red",
                Sowa: "lime",
                Ochibashigure: "magenta",
                Hirenaga: "gold",
                Tancho: "purple",
                Kiryuu: "orange",
                Sanke: "volcano",
                Showa: "green",
                Utsurimono: "blue",
                Bekko: "cyan",
                Asagi: "geekblue",
                Shusui: "purple",
              };
              const color = varietyColorMap[variety.name] || "gray";

              return (
                <Tag color={color} key={id} style={{ margin: "4px" }}>
                  {variety.name}
                </Tag>
              );
            })}

            {selectedFish?.video_url && (
              <p>
                <strong>Video:</strong>{" "}
                <a href={selectedFish?.video_url} target="_blank" rel="noopener noreferrer">
                  Watch Video
                </a>
              </p>
            )}
          </div>
        </Card>
      )}

      <Modal
        width={1300}
        title="Select Fish"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        footer={null}
      >
        <Table dataSource={fishList} columns={koiColumns} />
      </Modal>
    </div>
  );

  console.log(selectedFish);

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
      <Form.Item name="status" label="Status" style={{ flex: 1 }}>
        <Select
          onChange={(value) => onChangeFilter("status", value)}
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
      <Form.Item name="startDate" label="Start Date" style={{ flex: 1 }}>
        <DatePicker
          onChange={(date, dateString) => onChangeFilter("startDate", dateString)}
          format="YYYY-MM-DD"
          placeholder="Select start date"
          style={{ width: "100%", borderRadius: "4px" }}
        />
      </Form.Item>

      {/* End Date Filter */}
      <Form.Item name="endDate" label="End Date" style={{ flex: 1 }}>
        <DatePicker
          onChange={(date, dateString) => onChangeFilter("endDate", dateString)}
          format="YYYY-MM-DD"
          placeholder="Select end date"
          style={{ width: "100%", borderRadius: "4px" }}
        />
      </Form.Item>
    </div>
  );
  return (
    <div style={{ margin: "100px auto" }}>
      <BasicFilter filterItems={filterItems} />
      <DashboardTemplate
        form={form}
        isRerender={render}
        apiUriPOST="auctionRequest"
        formItems={formItems}
        title={title}
        columns={columns}
        dateFields={"createdDate"}
        keyField={"koi_id"}
        formViewDetailsItem={formViewDetailsItems}
        isBasicCRUD={false}
        isIncludeImage={false}
        apiURI={"auctionRequest/koiBreeder/pagination/filter"}
        formViewDetails={formViewDetails}
        isShownCardKoiFish={true}
        isCreateNew={true}
        selectedFish={selectedFish}
        setSelectedFish={setSelectedFish}
        paginationTarget={"auctionRequestResponseList"}
        setIsRender={setRender}
        filterParams={filters}
      />
    </div>
  );
}

export default ManageAuctionRequestOfKoiBreeder;
