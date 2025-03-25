import React from 'react';
import { Card, Tag, Typography, Space } from 'antd';
import { Website } from '@/lib/types';
import { LinkOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface WebsiteCardProps {
  website: Website;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ website }) => {
  return (
    <Card 
      hoverable 
      className="h-full flex flex-col"
      actions={[
        <a 
          key="visit" 
          href={website.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center"
        >
          <LinkOutlined className="mr-1" /> 访问
        </a>
      ]}
    >
      <div className="flex-1">
        <Title level={4} className="mb-2">{website.name}</Title>
        <Text type="secondary" className="block mb-3">{website.description}</Text>
        <Space size={[0, 8]} wrap>
          {website.tags?.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
      </div>
    </Card>
  );
};

export default WebsiteCard;