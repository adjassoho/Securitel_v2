import ScrollToTopAdvanced from './ScrollToTopAdvanced';

const ScrollToTopDemo = () => {
  return (
    <div className="space-y-4">
      {/* Version par défaut avec progression */}
      <ScrollToTopAdvanced 
        variant="progress" 
        position="bottom-right" 
        size="md" 
        threshold={200}
      />
      
      {/* Version minimale pour les pages simples */}
      {/* <ScrollToTopAdvanced 
        variant="minimal" 
        position="bottom-left" 
        size="sm" 
        threshold={300}
      /> */}
      
      {/* Version flottante pour les pages avec beaucoup de contenu */}
      {/* <ScrollToTopAdvanced 
        variant="floating" 
        position="bottom-center" 
        size="lg" 
        threshold={400}
      /> */}
    </div>
  );
};

export default ScrollToTopDemo;