import Container from '@/components/Container';
import { Button } from '../components/ui/button';

const Home = ()=>{
  return (
  <Container className=" bg-shop-light-pink">
    <h2 className="text-xl font-semibold">Home</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  <Button size="lg">Check out</Button>
  </Container>
  );
};

export default Home;