import { useEffect, useState } from "react";
import { Button, Input, Table } from "reactstrap";
import { getIncompleteWorkOrders, updateAsComplete, updateWorkOrder } from "../../managers/workOrderManager.js";
import { Link } from "react-router-dom";
import { getUserProfiles } from "../../managers/userProfileManager.js";

const testWorkOrders = [
  {
    id: 1,
    description: "bent fork",
    dateInitiated: "2023-07-12T00:00:00",
    dateCompleted: null,
    userProfile: null,
    userProfileId: null,
    bikeId: 1,
    bike: {
      id: 1,
      brand: "Huffy",
      color: "red",
      ownerId: 1,
      bikeTypeId: 1,
      bikeType: {
        id: 1,
        name: "Mountain",
      },
      owner: {
        id: 1,
        name: "bob",
        address: "101 main street",
        email: "bob@bob.comx",
        telephone: "123-456-7890",
      },
    },
  },
  {
    id: 2,
    description: "broken brakes",
    dateInitiated: "2023-07-15T00:00:00",
    dateCompleted: null,
    userProfile: {
      id: 1,
      firstName: "Tony",
      lastName: "The Tiger",
      address: "102 fourth street",
      email: "tony@thetiger.comx",
      roles: ["Admin"],
      identityUserId: "asdgfasdfvousdag",
    },
    userProfileId: 1,
    bikeId: 2,
    bike: {
      id: 2,
      brand: "Schwinn",
      color: "blue",
      ownerId: 2,
      bikeTypeId: 1,
      bikeType: {
        id: 1,
        name: "Mountain",
      },
      owner: {
        id: 2,
        name: "andy",
        address: "101 main street",
        email: "andy@bob.comx",
        telephone: "123-456-7890",
      },
    },
  },
];

export default function WorkOrderList({ loggedInUser }) {
    const [workOrders, setWorkOrders] = useState([]);
    const [mechanics, setMechanics] = useState([]);
    const assignMechanic = (workOrder, mechanicId) => {
        const clone = structuredClone(workOrder);
        clone.userProfileId = mechanicId || null;
        updateWorkOrder(clone).then(() => {
            getIncompleteWorkOrders().then(setWorkOrders);
        });
    };
    useEffect(() => {
        getIncompleteWorkOrders().then(setWorkOrders);
        getUserProfiles().then(setMechanics);
    }, []);
    useEffect(() => {
        getIncompleteWorkOrders().then(setWorkOrders);
    }, []);
    const completeWorkOrder = (workOrderId) => {
        const updatedWorkOrders = workOrders.map((wo) => {
            if (wo.id === workOrderId) {
                return { ...wo, DateCompleted: new Date() }; // Set DateCompleted to the current date
            }
            return wo;
        });
        updateAsComplete({ id: workOrderId, DateCompleted: new Date() }).then(() => {
            setWorkOrders(updatedWorkOrders);
        });
        window.location.reload();
    };
    const deleteAWorkOrder = (workOrderId) => {
        const workOrder = { id: workOrderId };
        deleteAWorkOrder(workOrderId).then(() => {
            window.location.reload();
        });
    };

  return (
    <>
      <h2>Open Work Orders</h2>
      <Link to="/workorders/create">New Work Order</Link>
      <Table>
        <thead>
          <tr>
            <th>Owner</th>
            <th>Brand</th>
            <th>Color</th>
            <th>Description</th>
            <th>DateSubmitted</th>
            <th>Mechanic</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {workOrders.map((wo) => (
            <tr key={wo.id}>
              <th scope="row">{wo.bike.owner.name}</th>
              <td>{wo.bike.brand}</td>
              <td>{wo.bike.color}</td>
              <td>{wo.description}</td>
              <td>{new Date(wo.dateInitiated).toLocaleDateString()}</td>
              <td>
                {wo.userProfile
                  ? `${wo.userProfile.firstName} ${wo.userProfile.lastName}`
                  : "unassigned"}
              </td>
              <td>
<Input
    type="select"
    onChange={(e) => {
    assignMechanic(wo, parseInt(e.target.value));
    }}
    value={wo.userProfileId || 0}
>
    <option value="0">Choose mechanic</option>
    {mechanics.map((m) => (
    <option
        key={m.id}
        value={m.id}
    >{`${m.firstName} ${m.lastName}`}</option>
    ))}
</Input>
</td>
<td>
{wo.userProfile && (
    <Button
    onClick={() => completeWorkOrder(wo.id)}
    color="success"
    >
    Mark as Complete
    </Button>
)}
</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}