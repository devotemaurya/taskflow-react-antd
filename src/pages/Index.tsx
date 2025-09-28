import React from 'react';
import { Layout, Typography, Divider, Alert } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  const isDemo = !import.meta.env.VITE_API_BASE_URL;

  const handleTaskCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto flex items-center h-16">
          <div className="flex items-center space-x-3">
            <RocketOutlined className="text-2xl text-blue-600" />
            <Title level={2} className="mb-0 text-gray-900">
              Task Manager {isDemo && <span className="text-sm text-orange-500">(Demo Mode)</span>}
            </Title>
          </div>
          <div className="ml-4">
            <Text type="secondary">
              Manage and execute your tasks efficiently
            </Text>
          </div>
        </div>
      </Header>
      
      <Content className="max-w-7xl mx-auto w-full p-6">
        {isDemo && (
          <Alert
            message="Demo Mode Active"
            description="You're seeing mock data. To connect to a real API, set VITE_API_BASE_URL in your .env file."
            type="info"
            showIcon
            className="mb-4"
            closable
          />
        )}
        
        <TaskForm onTaskCreated={handleTaskCreated} />
        <Divider />
        <TaskList refreshTrigger={refreshTrigger} />
      </Content>
    </Layout>
  );
};

export default Index;
