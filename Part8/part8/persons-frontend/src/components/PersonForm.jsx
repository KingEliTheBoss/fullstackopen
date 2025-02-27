import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { ALL_PERSONS, CREATE_PERSON } from "../queries";
import { updateCache } from "../App";

/*const CREATE_PERSON = gql`
mutation createPerson($name: String!, $street: String!, $city: String!, $phone: String)
{
    addPerson(
        name: $name,
        street: $street,
        city: $city,
        phone: $phone
    )   {
        name,
        phone,
        id,
        address {
            street,
            city
        }
    }
}
`;

const ALL_PERSONS = gql`
  query {
    allPersons {
      name,
      phone,
      id
    }
  }
`;*/

const PersonForm = ({ setError }) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");

    const [createPerson] = useMutation(CREATE_PERSON, {
        //refetchQueries: [{ query: ALL_PERSONS }], //gets all persons again after adding a person, not necessary if update callback is made well
        onError: (error) => {
            const messages = error.graphQLErrors.map(e => e.message).join("\n");
            setError(messages);
        },
        update: (cache, response) => {
            updateCache(cache, { query: ALL_PERSONS }, response.data.addPerson);
        }
    });

    const submit = (event) => {
        event.preventDefault();

        createPerson({
            variables: {
                name, street, city,
                phone: phone.length > 0 ? phone : undefined
            }
        });

        setName("");
        setPhone("");
        setStreet("");
        setCity("");
    };

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={submit}>
                <div>
                    name <input value={name} onChange={({ target }) => setName(target.value)} />
                </div>
                <div>
                    phone <input value={phone} onChange={({ target }) => setPhone(target.value)} />
                </div>
                <div>
                    street <input value={street} onChange={({ target }) => setStreet(target.value)} />
                </div>
                <div>
                    city <input value={city} onChange={({ target }) => setCity(target.value)} />
                </div>
                <button type="submit">add!</button>
            </form>
        </div>
    )
};

export default PersonForm;