import React from 'react';

import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FiPower } from 'react-icons/fi';
import { IoIosCut, IoIosCalendar } from 'react-icons/io';
import {
  FaBookOpen,
  FaBox,
  FaBoxOpen,
  FaChartPie,
  FaDollarSign,
  FaFileArchive,
  FaSprayCan,
  FaUsers,
} from 'react-icons/fa';
import { IoSettings } from 'react-icons/io5';
import {
  Avatar,
  Flex,
  Heading,
  IconButton,
  LinkButton,
  MenuHeader,
  PageHeader,
  Sidebar,
  Text,
  MenuTitle,
  MenuItem,
  SubMenu,
  SubMenuTitle,
  SubMenuSeparator,
  SubMenuItem,
} from '@atmoutsourcing/siakit';
import PackageJSON from '../../../package.json';
import { Container, Options, Content } from './styles';
import { useAuth } from '../../hooks/auth';

import logoImg from '../../assets/logo.png';

type Props = {
  children?: React.ReactNode;
}


function Menu({ children }: Props): JSX.Element {
  const { user, signOut } = useAuth();
  // const navigate = useNavigate();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <Container>
      {/* <Sidebar>
        <Menu>
          <MenuHeader>
            <p>header</p>
          </MenuHeader>
          <MenuTitle>
            header
          </MenuTitle>
          <MenuItem value='item'>
            teste
          </MenuItem>
        </Menu>
      </Sidebar> */}
      <Options>
        <div>
          <img src={logoImg} alt="AllanHebert" />
        </div>
        <Link to="/schedule">
          <div>
            <IoIosCalendar />
          </div>
          <p>Agenda</p>
        </Link>
        <Link to="/order">
          <div>
            <IoIosCut />
          </div>
          <p>Atendimentos</p>
        </Link>
        <Link to="/services">
          <div>
            <FaBookOpen />
          </div>
          <p>Serviços</p>
        </Link>
        <Link to="/users">
          <div>
            <FaUsers />
          </div>
          <p>Usuários</p>
        </Link>
        <Link to="/products">
          <div>
            <FaSprayCan />
          </div>
          <p>Produtos</p>
        </Link>
        <Link to="/reports">
          <div>
            <FaFileArchive />
          </div>
          <p>Relatórios</p>
        </Link>
        <Link to="/configbarberhour">
          <div>
            <IoSettings />
          </div>
          <p>Configuração</p>
        </Link>
        <Link to="/cashregister">
          <div>
            <FaDollarSign />
          </div>
          <p>Caixa</p>
        </Link>
      </Options>
      <div
        style={{ display: 'flex', overflow: 'auto', flexDirection: 'column' }}
      >
        <PageHeader title="Barber">
          <Flex align='center' gap={4}>
            <Heading size='sm'>v {PackageJSON.version}</Heading>
            {/* <LinkButton onClick={() => navigate("/profile")}>{user?.username}</LinkButton> */}
            <Avatar name={user?.username} size="sm" src={user?.avatar_url} />
            <IconButton icon={<FiPower />} type="button" colorScheme='red' />
          </Flex>
        </PageHeader>
        <Content>
          {children}
        </Content>
      </div>
    </Container>
  );
};

export default Menu;
