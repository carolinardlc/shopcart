import Container from '@/components/Container';
import { Button } from '../components/ui/button';
import TestApiComponent from '@/components/TestApiComponent';

const Home = ()=>{
  return (
  <Container className=" bg-shop-light-pink">
    <h2 className="text-xl font-semibold mb-4">Home</h2>
    <p className="mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    
    {/* Componente de prueba para la conexión Backend-Frontend */}
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Prueba de Conexión Backend-Frontend</h3>
      <TestApiComponent />
    </div>
    
    <Button size="lg">Check out</Button>
  </Container>
  );
};

export default Home;