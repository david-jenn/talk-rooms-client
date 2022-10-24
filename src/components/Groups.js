
import CreateGroup from "./CreateGroup";
import GroupList from "./GroupList";
import GroupRequest from "./GroupRequests";



function Groups({auth, user}) {

  

  return (
    <div>
      <CreateGroup auth={auth} user={user} />
      <GroupList />
      <GroupRequest />
    </div>
  )
}

export default Groups;