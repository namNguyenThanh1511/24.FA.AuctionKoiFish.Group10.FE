import { Alert, Form, Input, Tag, Tooltip } from "antd";
import { useForm } from "antd/es/form/Form";
import DashboardManageRequestTemplate from "../../../components/dashboard-manage-request-template";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

function ManageAuctionRequest() {
  const title = "Auction Request";
  const [formViewDetails] = useForm();
  const [form] = useForm();
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
        // If status is pending or response is empty, return an empty string
        if (record.status === "PENDING" || response === "") {
          return "";
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
        const checkStatus =
          (s == "ACCEPTED_BY_STAFF") | (s == "APPROVED_BY_MANAGER")
            ? "green"
            : s === "PENDING"
            ? "yellow"
            : "red";
        return <Tag color={checkStatus}>{s}</Tag>;
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

  return (
    <div style={{ margin: "100px auto" }}>
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
        apiURI={"auctionRequest"}
        formViewDetails={formViewDetails}
        isShownCardKoiFish={true}
        form={form}
        formItems={formItems}
        apiUriPUT={"auctionRequest/approve"}
        apiUriDelete={"auctionRequest/reject"}
      />
    </div>
  );
}

export default ManageAuctionRequest;
