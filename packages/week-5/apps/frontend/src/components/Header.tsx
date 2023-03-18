import { Navbar, Button, Link, Text } from '@nextui-org/react';
import useMetamask from '../hooks/useMetamask';
import ConnectWalletBtn from './ConnectWalletBtn';

const Header = () => {
  const { connect, status } = useMetamask();

  return (
    <Navbar isCompact variant="floating" isBordered css={{ padding: '5px 0 10px' }}>
      <Navbar.Brand>
        <Text b color="inherit" hideIn="xs">
          Dunder Mifflin Paper Company, Inc.
        </Text>
      </Navbar.Brand>
      <Navbar.Content hideIn="xs" activeColor="secondary" variant="highlight">
        <Navbar.Link isActive href="#">
          Lottery
        </Navbar.Link>
      </Navbar.Content>
      <Navbar.Content>
        <Navbar.Item>
          <ConnectWalletBtn onClick={connect} status={status} />
        </Navbar.Item>
      </Navbar.Content>
    </Navbar>
  );
};

export default Header;
