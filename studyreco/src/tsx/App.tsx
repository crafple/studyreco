import React, { useEffect, useState } from 'react';
import '../css/App.css';
import { default as axios } from 'axios';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Chart } from 'react-chartjs-2'
import jwtDecode from 'jwt-decode';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)


function App() {
  interface UserToken {
    id: number,
    email: string;

  }
  type Subject = {
    id: number,
    subjects: string,
    times: string
  }
  type User = {
    id: number,
    email: string,
    password: string,
    name: string,
    last_login_time: string
  }
  type UserProfile = {
    id: number,
    goal: string,
  }

  const navigate = useNavigate();

  const [subjectsList, setSubjectsList] = useState<Subject[]>([]);
  //管理しやすいため、Listとして管理している
  const [user, setUser] = useState<User[]>([]);

  const times = []
  const subjects_Names: string[] = []
  const subjects_Times: string[] = []


  const [last_login, set_Last_Login] = useState<Date>();
  const [last_login_str, set_Last_Login_Str] = useState('');
  const [_id, setId] = useState(0);
  const [_name, set_Name] = useState("");
  const [_email, set_Email] = useState("");
  const [_password, set_Password] = useState("");
  const [_last_login_time, set_Last_Login_Time] = useState("0");
  const [isshow_delete_btn, set_IsShow_Delete_Btn] = useState(false);

  const [selected_option, set_Selected_Option] = useState<String>();


  const [is_match, set_Is_Match] = useState(false);

  // jwtの認証
  useEffect(() => {
    axios.get('http://localhost:3001/getjwt', { withCredentials: true }).then((res) => {
      if (res.data == "fail") navigate("/Login");
      console.log("jwt");
      console.log(res.data);
      const token = res.data.jwt;
      const decoded_token = jwtDecode<UserToken>(token);
      console.log("decoded");
      set_Email(decoded_token.email);
      console.log(decoded_token.id);
      setId(decoded_token.id);
    })
  }, [])

  //最終ログインを表示
  useEffect(() => {
    let last_login_date = new Date(Number(_last_login_time));
    console.log("last_login_date");
    set_Last_Login(last_login_date);
  }, [_last_login_time])

  //最終ログインをフォーマットする
  useEffect(() => {
    let last_login_date = new Date(Number(_last_login_time));
    let year = last_login_date.getFullYear();
    let month = last_login_date.getMonth() + 1;
    let day = last_login_date.getDate();
    let dayofweek = last_login_date.getDay();
    const dayofweek_list = ['日', '月', '火', '水', '木', '金', '土'];
    let hour = last_login_date.getHours().toString();
    let minute = last_login_date.getMinutes().toString();

    let now = year + "年" + month + "月" + day + "日" + dayofweek_list[dayofweek] + "曜日" + hour + "時" + minute + "分"
    set_Last_Login_Str(now)

    //初期値の場合は表示しない
    if (last_login?.toString() == "Thu Jan 01 1970 09:00:00 GMT+0900 (GMT+09:00)") {
      set_Is_Match(true)
    } else {
      set_Is_Match(false)
    }
  }, [last_login])

  //データベースからユーザ情報を取得
  useEffect(() => {
    axios.get("http://localhost:3001/get/user", { withCredentials: true, params: { id: _id } }).then((res) => {
      setUser(res.data);
      if (res.data[0] != null) {
        console.log("res.data.name");
        console.log(res.data[0]);
        set_Name(res.data[0].name);
        set_Email(res.data[0].email);
        set_Password(res.data[0].password);
        set_Last_Login_Time(res.data[0].last_login_time);
      }
    });
  }, [_id]);

  //ユーザの登録科目を取得
  useEffect(() => {
    axios.get("http://localhost:3001/get/subjects", { withCredentials: true, params: { id: _id } }).then((res) => {
      setSubjectsList(res.data);
    });
  }, [_id]);

  //subjectListから科目名と時間を取得する
  for (let i in subjectsList) {
    if (subjectsList[i].subjects == null) {
      console.log("subjectList[i].subjectsはnull");
    } else {
      var names_list = subjectsList[i].subjects.split(',');
      var times_list = subjectsList[i].times.split(',');
      console.log(subjectsList[i].times)
      if (subjectsList[i].subjects == '未設定') {
        times.push(0)
        subjects_Times.push("0")
      } else {
        for (let i = 0; i < names_list.length; i++) {
          //console.log(name_list)
          subjects_Names.push(names_list[i])
        }
        for (let i = 0; i < times_list.length; i++) {
          //console.log(name_list)
          subjects_Times.push(times_list[i])
        }
        console.log("subjects_Name[0]");
        console.log(subjects_Names[0]);
      }
    }
  }


  const graphData = {
    labels: subjects_Names,
    datasets: [
      {
        data: times,
        label: '合計勉強時間'
      },
    ],
  };

  function handleLogout() {
    axios.get('http://localhost:3001/logout', { withCredentials: true }).then((res) => {
      console.log(res.data);
    })
    navigate("/Login")
  };

  //通常とレスポンシブ用で関数を分けている
  function navigateToSaveRecords(_subject_name: string) {
    const index = subjects_Names.findIndex(subject_Name => subject_Name === _subject_name)
    navigate("/SaveRecords", { state: { id: _id, subject_name_index: index } })
  };

  function responsive_navigateToSaveRecords() {
    const index = subjects_Names.findIndex(subject_Name => subject_Name === selected_option)
    navigate("/SaveRecords", { state: { id: _id, subject_name_index: index } })
  };


  function navigateToSubjectAdd() {
    navigate("/SubjectAdd")
  };

  function onClick_Delete(e: { stopPropagation: () => void; }, _select_subject_name: string) {
    e.stopPropagation();
    console.log("onClick_Delete")
    console.log(subjects_Names)
    console.log(_select_subject_name)
    //_select_subject_nameと合致する値を検索し、indexを返す。
    const index = subjects_Names.indexOf(_select_subject_name);
    subjects_Names.splice(index, 1)
    subjects_Times.splice(index, 1)
    console.log(subjects_Names.join(','))
    console.log(subjects_Names[0])
    let _subjects_names = subjects_Names.join(',')
    let _subjects_times = subjects_Times.join(',')
    //undefinedの場合には、初期値を代入してupdateを行う。
    if (subjects_Names[0] == undefined) {
      _subjects_names = "未設定"
      _subjects_times = "0"
      axios.put(`http://localhost:3001/update/subjects`, {
        _id,
        _subjects_names
      }).then(() => {
        console.log('success');
      });

      axios.put(`http://localhost:3001/update/times`, {
        _id,
        _subjects_times
      }).then(() => {
        console.log('success');
      });

    } else {
      axios.put(`http://localhost:3001/update/subjects`, {
        _id,
        _subjects_names

      }).then(() => {
        console.log('success');
      });
    }
    axios.put(`http://localhost:3001/update/times`, {
      _id,
      _subjects_times
    }).then(() => {
      console.log('success');
    });
    window.location.reload();
  }

  function responsive_onClick_Delete(e: { stopPropagation: () => void; }) {
    e.stopPropagation();
    if (selected_option == "選択してください") {
      return
    }
    console.log("onClick_Delete")
    console.log(subjects_Names)
    console.log(selected_option)
    //_select_subject_nameと合致する値を検索し、indexを返す。
    const index = subjects_Names.indexOf(String(selected_option));
    subjects_Names.splice(index, 1)
    subjects_Times.splice(index, 1)
    console.log(subjects_Names.join(','))
    console.log(subjects_Names[0])
    let _subjects_names = subjects_Names.join(',')
    let _subjects_times = subjects_Times.join(',')
    //undefinedの場合には、初期値を代入してupdateを行う。
    if (subjects_Names[0] == undefined) {
      _subjects_names = "未設定"
      _subjects_times = "0"
      axios.put(`http://localhost:3001/update/subjects`, {
        _id,
        _subjects_names
      }).then(() => {
        console.log('success');
      });

      axios.put(`http://localhost:3001/update/times`, {
        _id,
        _subjects_times
      }).then(() => {
        console.log('success');
      });

    } else {
      axios.put(`http://localhost:3001/update/subjects`, {
        _id,
        _subjects_names

      }).then(() => {
        console.log('success');
      });
    }
    axios.put(`http://localhost:3001/update/times`, {
      _id,
      _subjects_times
    }).then(() => {
      console.log('success');
    });
    window.location.reload();
  }

  //出席ボタンをクリックした際のイベント
  function handleAttend() {
    const _now_time = Date.now()
    axios.put(`http://localhost:3001/update/login`, {
      _id,
      _email,
      _name,
      _password,
      _now_time
    }).then(() => {
      console.log('success');
    });
    window.location.reload();
  }

  //バーガーメニューの表示・非表示の管理
  const [is_click_burger, set_Is_Click_Burger] = useState(false)

  function onClick_Burger() {
    console.log(is_click_burger)
    if (is_click_burger) {
      set_Is_Click_Burger(false)
    } else {
      set_Is_Click_Burger(true)
    }
  }

  //削除ボタンの表示の管理
  function showDeleteBtn() {
    if (isshow_delete_btn) {
      set_IsShow_Delete_Btn(false)
    }
    else {
      set_IsShow_Delete_Btn(true)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const _value = event.target.value;
    set_Selected_Option(_value);
    console.log(_value)
  };

  return (
    <div className="App">
      <header>
        <div className={'burger'} onClick={onClick_Burger}>
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
        <Link to="/" style={{ textDecoration: "none" }}><p className="logo">Studyreco+</p></Link>
        <nav>
          <ul className={`ul_menu ${is_click_burger ? "menu-active" : ""}`}>
            <li>ホーム</li>
            <Link to="/Profile" style={{ textDecoration: "none" }}><li>プロフィール</li></Link>
            <Link to="/Ranking" style={{ textDecoration: "none" }}><li>ランキング</li></Link>
            <Link to="/StudyRooms" style={{ textDecoration: "none" }}><li>自習室</li></Link>
            <Link to="/Contact" style={{ textDecoration: "none" }}><li>お問い合わせ</li></Link>
            <li><button className='login_btn' onClick={handleLogout}>ログアウト</button></li>
          </ul>
        </nav>
      </header>

      <p className='last-login'>最終ログイン：{is_match ? '' : last_login_str}</p>

      <div id="main">
        <div className='app-container'>
          <p className='login-info'>出席すると最終ログインが更新されます！</p>
          <button onClick={handleAttend} className='attend-btn'>出席する</button>
          <button className='edit-subject-btn' onClick={showDeleteBtn}>科目編集</button>
          <h3>勉強時間の目標</h3>
          <p>未設定</p>
          <h3>今月の学習目標時間設定</h3>
          <p>未設定</p>
          <h3>科目一覧(最大10科目まで登録可能です。)</h3>
          <div className="all-subjects">
            {subjects_Names.map((subjects_Name) => (
              <button className='subject-box' onClick={() => navigateToSaveRecords(subjects_Name)}>{subjects_Name}
                <div className='delete-btn' onClick={(e) => onClick_Delete(e, subjects_Name)} style={{ visibility: isshow_delete_btn ? "visible" : "hidden" }}>x</div>
              </button>
            ))}
          </div>
          <button className='res-add-subject-btn' onClick={navigateToSubjectAdd}>科目を追加</button>
          <div className='pulldown-all-subjects'>
            <label>科目一覧</label>
            <select onChange={handleChange}>
              <option>選択してください</option>
              {subjects_Names.map((subjects_Name) => (
                <option>{subjects_Name}</option>
              ))}
            </select>
          </div>

          <button className='delete-seletectedsubject-btn' onClick={responsive_onClick_Delete}>選択されている科目を削除</button>
          <button className='navigate-subject-btn' onClick={responsive_navigateToSaveRecords}>選択されている科目を勉強</button>
          <button className='add-subject-btn' onClick={navigateToSubjectAdd}>科目を追加</button>

        </div>
        <div className='app-right-container'>
          <h3>科目ごとの勉強時間</h3>
          <div style={{ height: "600px", position: "relative", marginBottom: "1%", padding: "1%" }}>
            <Bar data={graphData} /></div>
        </div>
      </div>
    </div>
  );
}

export default App;
