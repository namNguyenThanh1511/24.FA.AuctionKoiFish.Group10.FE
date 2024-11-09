import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import axios from "../../../config/axios";

const VarietyManagement = () => {
  const [varieties, setVarieties] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVariety, setEditingVariety] = useState(null);
  const [form] = Form.useForm();

  const fetchVarieties = async () => {
    try {
      const response = await axios.get("/variety/all");
      setVarieties(response.data);
    } catch (error) {
      message.error("Failed to load varieties");
      console.error(error);
    }
  };

  const showModal = (variety = null) => {
    if (variety) {
      setEditingVariety(variety);
      form.setFieldsValue({ name: variety.name });
    } else {
      setEditingVariety(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleAddOrUpdate = async (values) => {
    try {
      if (editingVariety) {
        await axios.put(`/variety/${editingVariety.id}`, values);
        message.success("Variety updated successfully");
      } else {
        await axios.post("/variety", values);
        message.success("Variety added successfully");
      }
      setIsModalVisible(false);
      fetchVarieties();
    } catch (error) {
      message.error("Failed to save variety");
      console.error(error);
    }
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this variety?",
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No, keep it",
      onOk: () => handleDelete(id),
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/variety/${id}`);
      message.success("Variety deleted successfully");
      fetchVarieties();
    } catch (error) {
      message.error("Failed to delete variety");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVarieties();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => showModal(record)}>Edit</Button>
          <Button onClick={() => confirmDelete(record.id)} danger style={{ marginLeft: 10 }}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ margin: "100px auto" }}>
      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 16 }}>
        Add Variety
      </Button>
      <Table dataSource={varieties} columns={columns} rowKey="id" />

      <Modal
        title={editingVariety ? "Edit Variety" : "Add Variety"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddOrUpdate}>
          <Form.Item
            name="name"
            label="Variety Name"
            rules={[{ required: true, message: "Please input the variety name!" }]}
          >
            <Input placeholder="Enter variety name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingVariety ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VarietyManagement;
