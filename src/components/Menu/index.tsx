import React from 'react'
import {
  FaBookOpen,
  FaBoxOpen,
  FaDollarSign,
  FaFileArchive,
  FaSprayCan,
  FaUsers,
} from 'react-icons/fa'
import { FiChevronDown, FiPower } from 'react-icons/fi'
import { IoIosCut, IoIosCalendar } from 'react-icons/io'
import { IoSettings } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'

import { Avatar } from '@siakit/avatar'
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from '@siakit/dropdown'
import { Heading } from '@siakit/heading'
import { Flex } from '@siakit/layout'
import { PageHeader } from '@siakit/page-header'
import { Text } from '@siakit/text'

import PackageJSON from '../../../package.json'
import logoImg from '../../assets/logo.png'
import { useAuth } from '../../hooks/auth'
import { Container, Options, Content } from './styles'

type Props = {
  children?: React.ReactNode
}

function Menu({ children }: Props) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return <>{children}</>
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
        <Link to="/inventory/purchaseproducts">
          <div>
            <FaBoxOpen />
          </div>
          <p>Lançamento (Produtos)</p>
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
          <Flex align="center" gap={4}>
            <Heading size="xs" lowContrast>
              v {PackageJSON.version}
            </Heading>
            <Dropdown>
              <DropdownTrigger>
                <Flex align="center" gap={8}>
                  <Avatar
                    name={user?.username}
                    size="sm"
                    src={user?.avatar_url}
                  />
                  <Text size="sm">{user?.username}</Text>
                  <FiChevronDown />
                </Flex>
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem
                  icon={<FiPower />}
                  type="danger"
                  onClick={() => {
                    signOut()
                    navigate('/')
                  }}
                >
                  Sair do sistema
                </DropdownItem>
                {/* <DropdownSeparator /> */}
                {/* <DropdownLabel /> */}
              </DropdownContent>
            </Dropdown>
            {/* <LinkButton onClick={() => navigate("/profile")}>{user?.username}</LinkButton> */}

            {/* <IconButton
              type="button"
              colorScheme="red"
              onClick={() => {
                signOut()
                navigate('/')
              }}
            >
              <FiPower />
            </IconButton> */}
          </Flex>
        </PageHeader>
        <Content>{children}</Content>
      </div>
    </Container>
  )
}

export default Menu
