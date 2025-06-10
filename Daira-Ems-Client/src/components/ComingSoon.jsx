const ComingSoon = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: '1rem',
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 5rem)',
          fontWeight: '900',
          color: '#5D08B3',
          textAlign: 'center',
        }}
      >
        Coming Soon
      </h1>
    </div>
  );
};

export default ComingSoon;
