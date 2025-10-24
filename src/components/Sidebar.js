import "./Sidebar.css";


const Sidebar = ({isOpen,windows,onRestore,toggleSidebar, participants = []}) => {

  

  

  return (
    <div>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2>Windows</h2>
        <ul>
        {
            windows.map((data) =>(
            <li key={data.id}>
            <button onClick={() =>{ 
                onRestore(data.id)
                toggleSidebar()

            }}>{data.title}</button>
          </li>
            ))
        }
        </ul>  
        <hr style={{borderColor: 'rgba(255,255,255,0.1)'}} />
        <h3>Participants</h3>
        <ul className="participants-list">
          {participants.length === 0 && <li style={{color: 'rgba(255,255,255,0.7)'}}>No participants</li>}
          {participants.map(p => (
            <li key={p.username} className="participant">
              <span className="participant-dot" style={{backgroundColor: p.color}} />
              <span className="participant-name">{p.username}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
