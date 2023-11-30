import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/SaveRecords.css';
import { default as axios } from 'axios';
import jwtDecode from 'jwt-decode';

function SaveRecords() {

  interface UserToken {
    id: number,
    email: string;
  }
  type User_Rank = {
    id: number,
    name: string,
    total_time: string
  }
  type Subject = {
    id: number,
    subjects: string,
    times: string
  }

  const navigate = useNavigate();
  const location = useLocation();
  const subjects_times: string[] = []
  const subjects_Names: string[] = []

  const [_id, setId] = useState(0);

  const [subjectsList, setSubjectsList] = useState<Subject[]>([]);
  const [user_rank, setUser_Rank] = useState<User_Rank>();

  useEffect(() => {
    axios.get('http://localhost:3001/getjwt', { withCredentials: true }).then((res) => {
      if (res.data == "fail") navigate("/Login");

      console.log("jwt");
      console.log(res.data);
      const token = res.data.jwt;
      const decoded_token = jwtDecode<UserToken>(token);
      console.log("decoded");

      console.log(decoded_token.id);
      setId(decoded_token.id);
    })
  }, [])

  //遷移されてきた科目のインデックスを代入
  const [index, setIndex] = useState(
    location.state ? location.state.subject_name_index : ''
  );

  function navigateToIndex() {
    navigate('/');
  }

  const [time, setTime] = useState(0);

  //データベースから科目を取得
  useEffect(() => {
    console.log(_id)
    axios.get("http://localhost:3001/get/subjects", { withCredentials: true, params: { id: _id } }).then((res) => {
      setSubjectsList(res.data);
      console.log(res.data);
    });
  }, [_id]);

  //ランキング更新用
  useEffect(() => {
    console.log("useEffect");
    console.log(_id);
    axios.get("http://localhost:3001/get/rank", { withCredentials: true, params: { id: _id } }).then((res) => {
      setUser_Rank(res.data);
      console.log(res.data);
    });
  }, [_id]);

  //値を更新しやすいよう調整
  for (let i in subjectsList) {
    var name_list = subjectsList[i].subjects.split(',');
    var times_list = subjectsList[i].times.split(',');
    if (subjectsList[i].subjects == '未設定') {
      subjects_times.push("0")
    } else {
      for (let i = 0; i < name_list.length; i++) {
        subjects_Names.push(name_list[i])
      }
      for (let i = 0; i < times_list.length; i++) {
        subjects_times.push(times_list[i])
      }
    }
  }


  const timerRef = useRef<ReturnType<typeof setInterval>>()

  //勉強時間を更新する
  const updateTime = async (e: { preventDefault: () => void; }) => {
    console.log("subject_names_list")

    subjects_times[index] = String(time + Number(subjects_times[index]));
    var subject_names_list = subjectsList[0].subjects;
    //そのままsubjects_timesを代入すると配列のまま代入されてしまう
    var subject_times_list = String(subjects_times)
    console.log("subjects_times")
    console.log(subjects_times)

    let _total_time = '0'
    for (let i = 0; i < subjects_times.length; i++) {
      console.log("time")
      console.log(subjects_times[i])
      _total_time = String(Number(subjects_times[i]) + Number(_total_time))
      console.log("_total_time")
      console.log(_total_time)
    }

    console.log("_id")
    console.log(_id)
    console.log("subject_names_list")
    console.log(subject_names_list)
    console.log("subject_times_list")
    console.log(subject_times_list)

    try {
      axios.put(`http://localhost:3001/update/studrecord`, {
        _id,
        subject_names_list,
        subject_times_list
      }).then(() => {
        console.log('success');
      });

      axios.put(`http://localhost:3001/update/rank`, {
        _id,
        _total_time,
      }).then(() => {
        console.log('success');
      });
    } catch (error) {
      console.log(error);
    }
    navigateToIndex()
    e.preventDefault();
  };

 //時間の計算処理

  const milliseconds = `0${time % 60}`.slice(-2);
  const seconds = `0${Math.floor(time / 60) % 60}`.slice(-2);
  const minutes = `0${Math.floor(time / 3600) % 60}`.slice(-2);
  const hours = `0${Math.floor(time / 21600) % 60}`.slice(-2);
  const days = `0${Math.floor(time / 518400)}`.slice(-2);

  //タイマー実行状態
  const [isRunning, setIsRunning] = useState(false);

  const handleStart = () => {
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setTime((time) => time + 1);
      console.log(time)
    }, 17);

  }
  const handleStop = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
  }

  function handleReset() {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setTime(0);
  }

  function handleLogout() {
    axios.get('http://localhost:3001/logout', { withCredentials: true }).then((res) => {

      console.log(res.data);
    })
    navigate("/Login")
  };

  const [is_click_burger, set_Is_Click_Burger] = useState(false)
  function onClick_Burger() {
    if (is_click_burger) {
      set_Is_Click_Burger(false)
    } else {
      set_Is_Click_Burger(true)
    }
  }

  return (
    <div className="SaveRecords">
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

      <div id="main">
        <div className='container-saverecords'>
          <div className="timer">
            <p>{days}:{hours}:{minutes}:{seconds}:{milliseconds}</p>
          </div>
          <div className='saverecords-btns'>
            <button className='btn-start' onClick={handleStart} disabled={isRunning}><p>開始</p></button>
            <button className='btn-stop' onClick={handleStop}><p>ストップ</p></button>
            <button className='btn-rest' onClick={handleReset}><p>リセット</p></button>
            <button className='btn-submit' onClick={updateTime} ><p>送信</p></button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SaveRecords;
