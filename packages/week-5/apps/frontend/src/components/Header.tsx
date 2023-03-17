import { Navbar, Button, Link, Text } from '@nextui-org/react';
import useMetamask from '../hooks/useMetamask';
import ConnectWalletBtn from './ConnectWalletBtn';

const Header = () => {
  const { connect, status } = useMetamask();

  return (
    <Navbar isCompact variant="sticky" css={{ padding: '10px 0' }}>
      <Navbar.Brand>
        <Text b color="inherit" hideIn="xs">
          Dunder Mifflin Paper Company, Inc.
        </Text>
      </Navbar.Brand>
      <Navbar.Content>
        <Navbar.Item>
          <ConnectWalletBtn onClick={connect} status={status} />
        </Navbar.Item>
      </Navbar.Content>
    </Navbar>
  );
};

export default Header;
