import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Profile.css';
import { default as axios } from 'axios';
import jwtDecode from 'jwt-decode';

function Profile() {

  const navigate = useNavigate();
  interface UserToken {
    id: number,
    email: string;
  }

  const [_id, setId] = useState(0);
  const [_email, setEmail] = useState("");
  const [_password, setPassword] = useState("");
  const [_name, set_Name] = useState("");

  //const [_total_time, set_Total_Time] = useState("");


  type Profile = {
    id: number;
    name: string;
    introduction: string;
    goal: string;
    monthly_goal: string;
  }

  type User_Rank = {
    id: number,
    name: string,
    total_time: string
  }

  const [profile, setProfile] = useState<Profile>();
  const [user_rank, setUser_Rank] = useState<User_Rank>();

  useEffect(() => {
    axios.get('http://localhost:3001/getjwt', { withCredentials: true }).then((res) => {
      console.log(res.data);
      if (res.data == 'fail') {
        navigate("/Login")
      }

      const token = res.data.jwt
      const decodedToken = jwtDecode<UserToken>(token);

      const _email = decodedToken.email;
      setEmail(_email)
      setId(decodedToken.id);


    })





  }, [])
  useEffect(() => {
    axios.get("http://localhost:3001/get/profile", { withCredentials: true, params: { id: _id } }).then((res) => {
      if (res.data[0] != null) {
        setProfile(res.data[0]);
      }

      console.log(res.data[0])
      console.log(profile)

    });
  }, [_id]);

  useEffect(() => {

    console.log("useEffect");
    console.log(_id);
    axios.get("http://localhost:3001/get/rank", { withCredentials: true, params: { id: _id } }).then((res) => {
      setUser_Rank(res.data[0]);
      //set_Total_Time(res.data[0].total_time)
      console.log(user_rank);
      console.log(user_rank?.total_time);

    });
  }, [_id]);

  useEffect(() => {
    console.log("useEffect");
    console.log(_id);
    axios.get("http://localhost:3001/get/user", { withCredentials: true, params: { id: _id } }).then((res) => {
      if (res.data[0] != null) {
        set_Name(res.data[0].name)
      }


    });
  }, [_id]);

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

  function navigateToEdit() {
    navigate("/Edit")
  };
  function navigateToAccount_Edit() {
    navigate("/Account_Edit")
  };


  return (
    <div className="Profile">
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
        <div className='profile-container'>
          <div className='user-description'>
            <div className='user-name'>
              <h2>ユーザー名：{_name}</h2>
            </div>
            <h2 className='introduce'>自己紹介</h2>
            <div className='user-introduction'>
              {profile?.introduction == "未設定" ? (
                <p>未設定</p>
              ) : (
                <p>{profile?.introduction}</p>
              )}
            </div>
          </div>
          <div className='detailed-userinfo'>
            <div className='detailed-userinfo-btns'>
              <button className='edit-account-btn' onClick={navigateToAccount_Edit}>利用者登録者情報の変更</button>
              <button className='edit-profile-btn2' onClick={navigateToEdit}>プロフィール編集</button>
            </div>
            <div className='monthly-objects'>
              <div className='total-time'>
                <h2>勉強時間の目標</h2>
                {profile?.goal == "未設定" ? (
                  <p>未設定</p>
                ) : (
                  <p>{Math.round(Number(user_rank?.total_time) / 216000)}/{profile?.goal}時間</p>
                )}
              </div>
              <h2>今月の勉強時間の目標</h2>
              {profile?.monthly_goal == "未設定" ? (
                <p>未設定</p>
              ) : (
                <p>{Math.round(Number(user_rank?.total_time) / 216000)}/{profile?.monthly_goal}時間</p>
              )}
            </div>
            <div className='future-objects'>
              <h2>合計勉強時間</h2>
              <table className='time-graph'>
                <tr>
                  <th>総計の勉強時間</th>
                  <th>今月の勉強時間</th>
                </tr>
                <tr>
                  <td>{Math.round(Number(user_rank?.total_time) / 216000)}</td>
                  <td>{Math.round(Number(user_rank?.total_time) / 216000)}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Profile;
