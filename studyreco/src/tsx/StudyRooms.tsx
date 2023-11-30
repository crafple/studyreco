import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../css/StudyRooms.css';
import jwtDecode from "jwt-decode";
import { io } from "socket.io-client";

function StudyRooms() {
  interface UserToken {
    id: number,
    email: string;
  }

  type Study_Room = {
    id: number,
    seat1: number,
    seat2: number,
    seat3: number,
    seat4: number,
    seat5: number,
    seat6: number,
    seat7: number,
    seat8: number,
    seat9: number,
    seat10: number,
  }

  const socket = io("http://localhost:3001");
  const navigate = useNavigate();

  const [_id, setId] = useState(0);
  const [_name, set_Name] = useState("");
  const [_email, set_Email] = useState("");
  const [_password, set_Password] = useState("");

  const [study_rooms_list, setStudy_RoomsList] = useState<Study_Room[]>([]);

  let _is_seated = false
  let is_correct_user = false

  function handleLogout() {
    axios.get('http://localhost:3001/logout', { withCredentials: true }).then((res) => {
      console.log(res.data);
    })
    navigate("/Login")
  };

  // jwtの認証
  useEffect(() => {
    axios.get('http://localhost:3001/getjwt', { withCredentials: true }).then((res) => {
      console.log("jwt");
      console.log(res.data);
      const token = res.data.jwt;
      const decodedToken = jwtDecode<UserToken>(token);
      console.log("decoded");
      console.log(decodedToken.id);
      setId(decodedToken.id);
    })
  }, [])
  //データベースからユーザーの情報を取得
  useEffect(() => {
    axios.get("http://localhost:3001/get/user", { withCredentials: true, params: { id: _id } }).then((res) => {
      if (res.data[0] != null) {
        _is_seated = res.data[0].is_seated
      }
    });
  }, [_id]);
//データベースから部屋の情報を取得
  useEffect(() => {
    axios.get("http://localhost:3001/get/studyrooms/seats", { withCredentials: true }).then((res) => {
      setStudy_RoomsList(res.data);
      console.log(res.data);
      if (res.data != null) {
        console.log(res.data[0]);
        if (res.data[0].seat1 != -1) {
          set_Room1_Seats(room1_seats.map((seat, index) => (index === 0 ? true : seat)))
        }
      }
    });
  }, []);

  const [room1_seats, set_Room1_Seats] = useState([false, false, false, false, false, false, false, false, false, false]);
  const [room_visible, setRoom_Visible] = useState(false);
  const [_room_num, set_Room_Num] = useState(-1);

  //部屋番号を確定
  function enter_Room1() {
    set_Room_Num(1)
    setRoom_Visible(true);
  };


  function click_Room1_Seat1() {
    const seat_num = 1;
    if (!room1_seats[0]) {
      set_Room1_Seats(
        //一致するものを探す
        room1_seats.map((seat, index) => (index === 0 ? true : seat))
      )
      updateSeats(seat_num)
    } else {
      console.log("click_Seat1_false")
      check_State(seat_num);
      if (is_correct_user) {
        set_Room1_Seats(
          room1_seats.map((seat, index) => (index === 0 ? false : seat))
        )
        updateVacantSeats(seat_num)
      }
    }
    console.log(room1_seats[0])
  };

  function click_Room1_Seat2() {
    const seat_num = 2;
    if (!room1_seats[1]) {
      set_Room1_Seats(
        room1_seats.map((seat, index) => (index === 1 ? true : seat))
      )
      updateSeats(seat_num)
    } else {
      set_Room1_Seats(room1_seats.map((seat, index) => (index === 1 ? false : seat)))
      updateVacantSeats(seat_num)
    }
  };

  function click_Room1_Seat3() {
    const seat_num = 3;
    if (!room1_seats[2]) {
      set_Room1_Seats(room1_seats.map((seat, index) => (index === 2 ? true : seat)))
      updateVacantSeats(seat_num)
    } else {
      set_Room1_Seats(room1_seats.map((seat, index) => (index === 2 ? false : seat)))
      updateVacantSeats(seat_num)
    }
  };

  function click_Room1_Seat4(){
    const seat_num = 4;
    if (!room1_seats[3]) {
      set_Room1_Seats(room1_seats.map((seat, index) => (index === 3 ? true : seat)))
      updateVacantSeats(seat_num)
    } else {
      set_Room1_Seats(room1_seats.map((seat, index) => (index === 3 ? false : seat)))
      updateVacantSeats(seat_num)
    }
  };

  function click_Room1_Seat5() {
    const seat_num = 4;
    if (!room1_seats[4]) {
      set_Room1_Seats(room1_seats.map((seat, index) => (index === 4 ? true : seat)))
      updateVacantSeats(seat_num)
    } else {
      set_Room1_Seats(room1_seats.map((seat, index) => (index === 4 ? false : seat)))
      updateVacantSeats(seat_num)
    }
  };

  function click_Room1_Seat6() {
    const seat_num = 5;
    if (!room1_seats[5]) {
      set_Room1_Seats(room1_seats.map((seat, index) => (index === 5 ? true : seat)))
      updateVacantSeats(seat_num)
    } else {
      set_Room1_Seats(room1_seats.map((seat, index) => (index === 5 ? false : seat)))
      updateVacantSeats(seat_num)
    }
  };

  function click_Room1_Seat7() {
    const seat_num = 6;
    if (!room1_seats[6]) {
      set_Room1_Seats(room1_seats.map((seat, index) => (index === 6 ? true : seat)))
      updateVacantSeats(seat_num)
    } else {
      set_Room1_Seats(room1_seats.map((seat, index) => (index === 6 ? false : seat)))
      updateVacantSeats(seat_num)
    }
  };

  function click_Room1_Seat8() {
    const seat_num = 7;
    if (!room1_seats[7]) {
      set_Room1_Seats(room1_seats.map((seat, index) => (index === 7 ? true : seat)))
      updateVacantSeats(seat_num)
    } else {
      set_Room1_Seats(room1_seats.map((seat, index) => (index === 7 ? false : seat)))
      updateVacantSeats(seat_num)
    }
  };

  function click_Room1_Seat9() {
    const seat_num = 8;
    if (!room1_seats[8]) {
      set_Room1_Seats(room1_seats.map((seat, index) => (index === 8 ? true : seat)))
      updateVacantSeats(seat_num)
    } else {
      set_Room1_Seats(room1_seats.map((seat, index) => (index === 8 ? false : seat)))
      updateVacantSeats(seat_num)
    }
  };

  function click_Room1_Seat10() {
    const seat_num = 9;
    if (!room1_seats[9]) {
      set_Room1_Seats(room1_seats.map((seat, index) => (index === 9 ? true : seat)))
      updateVacantSeats(seat_num)
    } else {
      set_Room1_Seats(room1_seats.map((seat, index) => (index === 9 ? false : seat)))
      updateVacantSeats(seat_num)
    }
  };

//席の状態を変える
  async function set_Is_Seated(num: Number) {
    console.log("_is_seated変更")
    if (num == 0) {
      console.log("set_Is_Seated(false)")
      _is_seated = false
    }
    else {
      console.log("set_Is_Seated(true)")
      _is_seated = true
    }
    console.log("終了")
  }

  async function connect_DB(_seat_num: Number) {
    try {
      await axios.put(`http://localhost:3001/update/studyroom`, {
        _id,
        _room_num,
        _seat_num,
      }).then(() => {
        console.log('success');
      });
    } catch (error) {
      console.log(error);
    }

    try {
      await axios.put(`http://localhost:3001/update/user/seat`, {
        _id,
        _is_seated,
      }).then(() => {
        console.log('success');
      });
    } catch (error) {
      console.log(error);
    }
  }

  const updateSeats = async (_seat_num: Number) => {
    console.log("席情報を更新します")
    console.log(_seat_num)
    console.log(_id)
    console.log("_room_num")
    console.log(_room_num)
    //サーバーへ送信
    socket.emit("update_seat", { _seat_num });
    await set_Is_Seated(1)
    console.log("_is_seated")
    console.log(_is_seated)
    await connect_DB(_seat_num)
  };

  //着席しているユーザーと退席しようとしているユーザーの確認
  async function check_State(_seat_num: Number) {
    await axios.get("http://localhost:3001/get/studyrooms/seats", { withCredentials: true, params: { id: _room_num } }).then((res) => {
      console.log(res.data[0]);
      if (res.data != null) {
        if (_seat_num == 0) {
          if (_id != res.data[0].seat1) {
            is_correct_user = false;
          }
        } else if (_seat_num == 1) {
          if (_id != res.data[0].seat1) {
            is_correct_user = false;
          }
        } else if (_seat_num == 2) {
          if (_id != res.data[0].seat2) {
            is_correct_user = false;
          }
        } else if (_seat_num == 3) {
          if (_id != res.data[0].seat3) {
            is_correct_user = false;
          }
        } else if (_seat_num == 4) {
          if (_id != res.data[0].seat4) {
            is_correct_user = false;
          }
        } else if (_seat_num == 5) {
          if (_id != res.data[0].seat5) {
            is_correct_user = false;
          }
        } else if (_seat_num == 6) {
          if (_id != res.data[0].seat6) {
            is_correct_user = false;
          }
        } else if (_seat_num == 7) {
          if (_id != res.data[0].seat7) {
            is_correct_user = false;
          }
        } else if (_seat_num == 8) {
          if (_id != res.data[0].seat8) {
            is_correct_user = false;
          }
        } else if (_seat_num == 9) {
          if (_id != res.data[0].seat9) {
            is_correct_user = false;
          }
          is_correct_user = true;
        }
      }
    });
  }

  const updateVacantSeats = async (_seat_num: Number) => {
    console.log("席情報を更新します")
    console.log(_seat_num)
    socket.emit("update_vacant_seat", { _seat_num });
    try {
      await axios.put(`http://localhost:3001/update/vacantseat`, {
        _room_num,
        _seat_num,
      }).then(() => {
        console.log('success');
      });
    } catch (error) {
      console.log(error);
    }
    await set_Is_Seated(0)
    try {
      await axios.put(`http://localhost:3001/update/user/seat`, {
        _id,
        _is_seated,
      }).then(() => {
        console.log('success');
      });
    } catch (error) {
      console.log(error);
    }



  };

  //サーバーから受信
  socket.on("received_update_seat", (data) => {
    if (data == 1) {
      room1_seats.map((seat, index) => (index === 0 ? true : seat));
    } else if (data = 2) {
      room1_seats.map((seat, index) => (index === 1 ? true : seat));
    } else if (data = 3) {
      room1_seats.map((seat, index) => (index === 2 ? true : seat));
    } else if (data = 4) {
      room1_seats.map((seat, index) => (index === 3 ? true : seat));
    } else if (data = 5) {
      room1_seats.map((seat, index) => (index === 4 ? true : seat));
    } else if (data = 6) {
      room1_seats.map((seat, index) => (index === 5 ? true : seat));
    } else if (data = 7) {
      room1_seats.map((seat, index) => (index === 6 ? true : seat));
    } else if (data = 8) {
      room1_seats.map((seat, index) => (index === 7 ? true : seat));
    } else if (data = 9) {
      room1_seats.map((seat, index) => (index === 8 ? true : seat));
    } else if (data = 10) {
      room1_seats.map((seat, index) => (index === 9 ? true : seat));
    }

  });

  socket.on("received_update_vacant_seat", (data) => {
    console.log("received_update_vacant_seat");
    if (data == 1) {
      room1_seats.map((seat, index) => (index === 0 ? false : seat));
    } else if (data = 2) {
      room1_seats.map((seat, index) => (index === 1 ? false : seat));
    } else if (data = 3) {
      room1_seats.map((seat, index) => (index === 2 ? false : seat));
    } else if (data = 4) {
      room1_seats.map((seat, index) => (index === 3 ? false : seat));
    } else if (data = 5) {
      room1_seats.map((seat, index) => (index === 4 ? false : seat));
    } else if (data = 6) {
      room1_seats.map((seat, index) => (index === 5 ? false : seat));
    } else if (data = 7) {
      room1_seats.map((seat, index) => (index === 6 ? false : seat));
    } else if (data = 8) {
      room1_seats.map((seat, index) => (index === 7 ? false : seat));
    } else if (data = 9) {
      room1_seats.map((seat, index) => (index === 8 ? false : seat));
    } else if (data = 10) {
      room1_seats.map((seat, index) => (index === 9 ? false : seat));
    }
  });

  const [is_click_burger, set_Is_Click_Burger] = useState(false)
  function onClick_Burger() {
    if (is_click_burger) {
      set_Is_Click_Burger(false)
    } else {
      set_Is_Click_Burger(true)
    }
  }

  return (
    <div className="StudyRooms">
      <header>
        <div className={'burger'} onClick={onClick_Burger}>
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
        <Link to="/" style={{ textDecoration: "none" }}><p className="logo">Studyreco+</p></Link>
        <nav>
          <ul className={`ul_menu ${is_click_burger ? "menu-active" : ""}`}>
            <Link to="/" style={{ textDecoration: "none" }}><li>ホーム</li></Link>
            <Link to="/Profile" style={{ textDecoration: "none" }}><li>プロフィール</li></Link>
            <Link to="/Ranking" style={{ textDecoration: "none" }}><li>ランキング</li></Link>
            <Link to="/StudyRooms" style={{ textDecoration: "none" }}><li>自習室</li></Link>
            <Link to="/Contact" style={{ textDecoration: "none" }}><li>お問い合わせ</li></Link>
            <li><button className='login_btn' onClick={handleLogout}>ログアウト</button></li>
          </ul>
        </nav>
      </header>
      <div className="box-studyrooms">
        <h3>自習室</h3>
        <p>席をクリックして着席します！退出する際には再度クリックすることで退出可能です。</p>
      </div>
      <div id="main_studyrooms">

        <div className="room1-container">
          <p>ボタンをクリックすることでルームが表示されます。</p>
          <button className="enter-btn" onClick={enter_Room1}>ルーム1に入室</button>
          <div className="room">
            <div className="room-box" style={{ visibility: room_visible ? "visible" : "hidden" }}>
              <div className="seat1" onClick={click_Room1_Seat1} style={{ backgroundColor: room1_seats[0] ? "black" : "white" }} />
              <div className="seat2" onClick={click_Room1_Seat2} style={{ backgroundColor: room1_seats[1] ? "black" : "white" }} />
              <div className="seat3" onClick={click_Room1_Seat3} style={{ backgroundColor: room1_seats[2] ? "black" : "white" }} />
              <div className="seat4" onClick={click_Room1_Seat4} style={{ backgroundColor: room1_seats[3] ? "black" : "white" }} />
              <div className="seat5" onClick={click_Room1_Seat5} style={{ backgroundColor: room1_seats[4] ? "black" : "white" }} />
            </div>
            <div className="room-box-right" style={{ visibility: room_visible ? "visible" : "hidden" }}>
              <div className="seat6" onClick={click_Room1_Seat6} style={{ backgroundColor: room1_seats[5] ? "black" : "white" }} />
              <div className="seat7" onClick={click_Room1_Seat7} style={{ backgroundColor: room1_seats[6] ? "black" : "white" }} />
              <div className="seat8" onClick={click_Room1_Seat8} style={{ backgroundColor: room1_seats[7] ? "black" : "white" }} />
              <div className="seat9" onClick={click_Room1_Seat9} style={{ backgroundColor: room1_seats[8] ? "black" : "white" }} />
              <div className="seat10" onClick={click_Room1_Seat10} style={{ backgroundColor: room1_seats[9] ? "black" : "white" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default StudyRooms;