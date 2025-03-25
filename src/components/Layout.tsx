import React, { ReactNode } from 'react';
import { Layout as AntLayout, Menu, Input, Button, theme } from 'antd';
import { SearchOutlined, GithubOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Header, Content, Sider } = AntLayout;

interface LayoutProps {
  children: ReactNode;
  onSearch?: (keyword: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onSearch }) => {
  const [searchValue, setSearchValue] = React.useState('');
  const { token } = theme.useToken();

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  return (
    <AntLayout className="min-h-screen">
      <Header className="flex items-center justify-between px-6" style={{ background: token.colorBgContainer }}>
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold mr-8">
            导航站
          </Link>
        </div>
        <div className="flex items-center">
          <Input 
            placeholder="搜索网站..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onPressEnter={handleSearch}
            className="w-64 mr-2"
            suffix={<SearchOutlined />}
          />
          <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
            搜索
          </Button>
          <a 
            href="https://github.com/zishengpro" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-4 text-lg"
          >
            <GithubOutlined />
          </a>
        </div>
      </Header>
      <AntLayout>
        <Content className="p-6">
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;