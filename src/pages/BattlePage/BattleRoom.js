import React, { useState, useEffect, cloneElement } from "react";
import { Container, Col, Row } from "react-bootstrap";
import io from "socket.io-client";
import CodePlayground from "../../components/CodePlayground/CodePlayground";
import { apiUrl } from "../../config/constants";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../store/user/selectors";
import { useParams } from "react-router-dom";
import { selectExercise } from "../../store/exercise/selectors";
import {
  getRandomExercise,
  setNewExercise,
} from "../../store/exercise/actions";

let socket;

export default function BattleRoom() {
  const initialCode = `//write here`;
  const editorName = "Your Code Editor";

  const params = useParams() || "nothing";
  const dispatch = useDispatch();
  const [winner, setWinner] = useState({});
  const [ready, setReady] = useState(false);
  const [code, setCode] = useState(initialCode);
  const [roomMembers, setRoomMembers] = useState([]);
  const randomExercise = useSelector(selectExercise);
  const user = useSelector(selectUser);

  socket = io(apiUrl);

  const userObject = {
    id: user.id,
    name: user.name,
    room: `Battle room of ${params.name}`,
  };

  const { name, room } = userObject;

  useEffect(() => {
    if (!ready && params.name === user.name && roomMembers.length > 1) {
      dispatch(getRandomExercise());
    }
  }, []);

  useEffect(() => {
    if (randomExercise && !ready) {
      socket.emit("add exercise", {
        id: user.id,
        room: room,
        exercise: randomExercise,
      });
    }
    if (!randomExercise) {
      socket.emit("i want exercise", room);
    }
    socket.on("refresh", (members) => {
      setRoomMembers(members);
    });
    socket.on("exercise", (exercise) => {
      dispatch(setNewExercise(exercise));
      setReady(true);
    });

    return () => {
      socket.emit("delete previous room", room);
      socket.off();
    };
  });

  useEffect(() => {
    if (!name) {
      return;
    }
    socket.emit("joined", userObject, (members) => {});

    return () => {
      socket.emit("unjoined", userObject, (members) => {});
      socket.off();
    };
  }, [user]);

  return user.accountType === "guest" ? (
    <h1>Please log in to Battle</h1>
  ) : roomMembers.length < 2 ? (
    <h1>Waiting for a challenger</h1>
  ) : (
    <Container>
      <Row>
        <Col className="col-2">
          {roomMembers.map((member, id) => (
            <p key={id + 1}>{member.name}</p>
          ))}
        </Col>
        <Col>
          {ready && (
            <CodePlayground
              initialState={initialCode}
              code={code}
              set_code={setCode}
              neededFunction={() => {
                console.log("I win");
              }}
              editorName={editorName}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}
