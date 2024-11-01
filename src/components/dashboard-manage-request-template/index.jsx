import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Table,
  Image,
  Row,
  Col,
  Space,
  Tooltip,
} from "antd";
import { DeleteOutlined, CheckOutlined, EyeOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../config/axios";
import dayjs from "dayjs";
import CardKoiFish from "../card-koi-fish";

function DashboardManageRequestTemplate({
  columns,
  title,
  formItems,
  apiURI,
  dateFields = [],
  keyField,
  formViewDetailsItem,
  isBasicCRUD,
  isIncludeImage,
  isRerender,
  form,
  apiUriPOST,
  apiUriPUT,
  apiUriDelete,
  formViewDetails,
  isShownCardKoiFish,
  isCreateNew,
  paginationTarget,
  filterParams,
}) {
  const [dataSource, setDataSource] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [tableColumns, setTableColumns] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [actions, setActions] = useState();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [isRerender]);

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, []);

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [filterParams]);

  useEffect(() => {
    const newColumns = [
      ...columns,
      {
        title: "Action",
        dataIndex: keyField,
        key: keyField,
        render: (id, record) => (
          <Space size="middle">
            <Tooltip title="Reject Request">
              {record.status === "PENDING" ? (
                <Popconfirm
                  title={`Delete ${title}`}
                  description="Are you sure to reject this request?"
                  onConfirm={() => {
                    setIsUpdate(true);
                    handleOpenModal();
                    form.setFieldsValue({ [keyField]: id });
                    setActions(apiUriDelete);
                  }}
                >
                  <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
              ) : (
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  className="blur-button"
                />
              )}
            </Tooltip>
            <Tooltip title="Approve Request">
              {record.status === "PENDING" ? (
                <Button
                  type="primary"
                  style={{ backgroundColor: "green" }}
                  icon={<CheckOutlined />}
                  size="small"
                  onClick={() => {
                    setIsUpdate(true);
                    handleOpenModal();
                    form.setFieldsValue({ [keyField]: id });
                    setActions(apiUriPUT);
                  }}
                />
              ) : (
                <Button
                  type="primary"
                  style={{ backgroundColor: "green" }}
                  icon={<CheckOutlined />}
                  size="small"
                  className="blur-button"
                />
              )}
            </Tooltip>
            <Tooltip title="View Details">
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => {
                  const newRecord = { ...record };
                  setCurrentRecord(newRecord);
                  setIsViewModalOpen(true);
                  for (var key of Object.keys(newRecord)) {
                    const value = newRecord[key];
                    if (dateFields.includes(key)) {
                      newRecord[key] = dayjs(value);
                    } else {
                      newRecord[key] = record[key];
                    }
                  }
                  formViewDetails.setFieldsValue(newRecord);
                }}
              />
            </Tooltip>
          </Space>
        ),
      },
    ];
    setTableColumns(newColumns);
  }, [columns]);

  const fetchData = async (current, pageSize) => {
    const filterParamsAfterEncode = Object.entries(filterParams)
      .filter(([key, value]) => value !== undefined && value !== "" && value != null) // Filter out empty strings and undefined values
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
    console.log(filterParamsAfterEncode);
    try {
      const response = await api.get(
        `${apiURI}?page=${current - 1}&size=${pageSize}${
          filterParamsAfterEncode ? `&${filterParamsAfterEncode}` : ""
        }`
      );
      setIsFetching(false);
      setDataSource(response.data[paginationTarget]);
      setPagination({
        current,
        pageSize,
        total: response.data.totalElements,
      });
    } catch (err) {
      console.log(err);
      toast.error(err.response.data);
    }
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    form.resetFields();
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setCurrentRecord(null);
  };

  const handleSubmitForm = async (values) => {
    setLoading(true);
    try {
      await api.put(`${actions}/${values[keyField]}`, values);
      toast.success("Successfully updated");
      form.resetFields();
      handleCloseModal();
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      toast.error(error.response.data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await api.put(`${apiUriDelete}/${id}`);
      toast.success("Deleted successfully");
      fetchData(pagination.current, pagination.pageSize);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
    fetchData(pagination.current, pagination.pageSize);
  };

  return (
    <div>
      {isCreateNew ? (
        <Button
          onClick={() => {
            setIsUpdate(false);
            handleOpenModal();
          }}
          type="primary"
        >
          Add new {title}
        </Button>
      ) : (
        []
      )}

      <Table
        pagination={pagination}
        onChange={handleTableChange}
        columns={tableColumns}
        dataSource={dataSource}
        loading={isFetching}
      />
      <Modal
        open={isOpenModal}
        title={isUpdate === true ? `Edit ${title}` : `Create new ${title}`}
        onCancel={handleCloseModal}
        footer={
          <>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button
              onClick={() => {
                form.submit();
              }}
              loading={loading}
            >
              Save
            </Button>
          </>
        }
      >
        <Form labelCol={{ span: 24 }} onFinish={handleSubmitForm} form={form}>
          <Form.Item name={keyField} hidden>
            <Input />
          </Form.Item>
          {formItems}
        </Form>
      </Modal>
      <Modal
        width={800}
        open={isViewModalOpen}
        title={`View ${title} details`}
        onCancel={handleCloseViewModal}
        footer={<Button onClick={handleCloseViewModal}>Close</Button>}
      >
        <Form labelCol={{ span: 24 }} form={formViewDetails}>
          <Form.Item name={keyField} hidden>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>{formViewDetailsItem}</Col>
            <Col span={12}>
              {isShownCardKoiFish && <CardKoiFish id={formViewDetails.getFieldValue("koi_id")} />}
              {isIncludeImage ? (
                <Form.Item label="Image" name="image_url">
                  {currentRecord && currentRecord.image_url ? (
                    <Image width={200} src={currentRecord.image_url} />
                  ) : (
                    <span>No image available</span>
                  )}
                </Form.Item>
              ) : (
                []
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
      <style jsx>{`
        .blur-button {
          opacity: 0.5; /* Make the button appear faded */
          pointer-events: none; /* Disable mouse events for blurred buttons */
        }
      `}</style>
    </div>
  );
}

export default DashboardManageRequestTemplate;
