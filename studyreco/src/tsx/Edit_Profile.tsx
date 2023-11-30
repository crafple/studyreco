import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Edit_Profile.css';
import { default as axios } from 'axios';
import jwtDecode from 'jwt-decode';

function Edit_Profile() {

  interface UserToken {
    id: number,
    email: string;
  }

  type Profile = {
    id: number;
    name: string;
    introduction: string;
    goal: string;
    monthly_goal: string;
  }
  const [profile, setProfile] = useState<Profile>();
  const [_id, set_Id] = useState(0);
  const [_email, setEmail] = useState("");
  const [_name, set_Name] = useState(profile?.name);

  let _introduction: string | undefined = ""
  let _goal = profile?.goal
  let _monthly_goal = profile?.monthly_goal

  const navigate = useNavigate();
  function navigateToProfile() {
    navigate('/Profile');
  }

  //jwtを取得する
  useEffect(() => {
    axios.get('http://localhost:3001/getjwt', { withCredentials: true }).then((res) => {
      console.log(res.data.jwt);
      const token = res.data.jwt;
      console.log();
      const decoded = jwtDecode<UserToken>(token);
      set_Id(decoded.id);
      setEmail(decoded.email);
    })
  }, [])
  //プロフィール情報を取得する
  useEffect(() => {
    axios.get("http://localhost:3001/get/profile", { withCredentials: true, params: { id: _id } }).then((response) => {
      console.log("id");
      console.log(_id);
      console.log(response.data[0]);
      setProfile(response.data[0]);
      if (response.data[0] == null) {
        console.log("profile.introduction");
      }
    });
  }, [_id]);

  const introductionChange = (e: { target: { value: string; }; }) => {
    _introduction = e.target.value;
    console.log(e.target.value);
  };

  const handleAnualChange = (e: { target: { value: string; }; }) => {
    _goal = e.target.value;
    console.log(e.target.value);
  };

  const handleMonthlyChange = (e: { target: { value: string; }; }) => {
    _monthly_goal = e.target.value;
    console.log(e.target.value);
  };

  const updateProfile = async (e: { preventDefault: () => void; }) => {
    if (profile?.introduction == _introduction || '' == _introduction) {
      console.log("profile?.introduction");
      console.log(profile?.introduction);
      _introduction = profile?.introduction;
    }

    console.log("_introduction")
    console.log(_introduction)

    e.preventDefault();

    try {
      axios.put(`http://localhost:3001/update/profile`, {
        _id,
        _introduction,
        _goal,
        _monthly_goal
      }).then(() => {
        console.log('成功しました');
      });
      navigateToProfile();
    } catch (error) {
      console.log(error);
    }
  };

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
    <div className="Edit">
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
        <div className='edit-profile-container'>
          <div className='user-description'>
            <div className='user-name'>
              <h2>ユーザー名：{_email}</h2>
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
            <div className='introduction'>
              <h2>自己紹介</h2>
              <textarea onChange={introductionChange} ></textarea >
            </div>
            <div className='monthly-object'>
              <h2>勉強時間の目標</h2>
              <input type="number" max="10000" min="1" onChange={handleAnualChange} ></input>
            </div>
            <div className='future-object'>
              <h2>今月の勉強時間の目標</h2>
              <input type="number" max="10000" min="1" onChange={handleMonthlyChange} ></input >
            </div>
            <button onClick={updateProfile} className='update-profile-btn'>確定する</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Edit_Profile;
