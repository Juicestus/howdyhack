import React from "react";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
// import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Collapse, IconButton, ListSubheader } from '@mui/material';
import { Subtopic, Topic, Topics } from '../data/Types';
import { auth, getUserDB } from '../FirebaseClient';
import { AuthContext } from './AuthContext';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Button, ListGroup, Modal } from "react-bootstrap";
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import { useLocation, useNavigate } from "react-router-dom";
import Check from "@mui/icons-material/Check";


type Anchor = 'left';

 export const sortfn = (a: string, b: string) => {
    return parseFloat(a.split(' ')[0]) - parseFloat(b.split(' ')[0]); // danger ):
  }

export const SidebarDrawer = () => {

  const location = useLocation();

  const [error, setError] = React.useState<string>("");

  const navigate = useNavigate();

  const user = React.useContext(AuthContext);

  const [topicTree, setTopicTree] = React.useState<Topics>({})

  React.useEffect(() => {
    if (user) {
      getUserDB(user.uid).then(d => setTopicTree(d));
    }

  }, [user, setTopicTree]);

  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }
        setIsOpen(open);
      };

 

  const topicIcon = (t: Topic) => {
    let allLocked = true;
    let allCompleted = false;
    for (const key in t.subtopics) {
      if (!t.subtopics[key].locked) {
        allLocked = false;
      }
      if (t.subtopics[key].completed) {
        allCompleted = true;
      }
    }
    if (allCompleted) {
      // return <CheckCircleOutlineIcon />;
      return <Check />;
    }
    if (allLocked) {
      return <LockIcon />;
    }
    
    return <AccessTimeIcon />;
  }

  const subtopicIcon = (t: Subtopic) => {
    if (t.locked) {
      return <LockIcon />;
    }
    if (t.completed) {
      // return <CheckCircleOutlineIcon />;
      return <Check />;
    }
    return <AccessTimeIcon />;
  }

  const signOut = () => {
    auth.signOut();
  };

  const profilPicSrc = (): string => {
    return "https://ui-avatars.com/api/?name=" + (user?.displayName?.replaceAll(' ', '+') || "Ol Rock");
  };

  const [menuToOpen, setMenuToOpen] = React.useState("");

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: '20rem' }}
      role="presentation"
      // onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >

      <List>
        {/* <ListGroup> */}
          <ListItem>
            <Avatar alt="Remy Sharp" src={profilPicSrc()} className="mr-4"/>
            <ListItemText primary={user?.displayName?.split(' ')[0] || "Ol Rock"} />
            <IconButton onClick={() => navigate('/dashboard')}> <HomeIcon/> </IconButton>
            <IconButton onClick={signOut}> <LogoutIcon/> </IconButton>

          </ListItem>

        {Object.keys(topicTree).sort(sortfn).map(key =>
        (
          <>
            <Divider />
            <ListItemButton onClick={() => { setMenuToOpen(key) }}>
              <ListItemIcon>
                {topicIcon(topicTree[key])}
              </ListItemIcon>
              <ListItemText primary={topicTree[key].name} />
              {menuToOpen === key ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={menuToOpen === key} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {Object.keys(topicTree[key].subtopics).sort(sortfn).map(key2 =>
                  <ListItemButton sx={{ pl: 4 }} onClick={() => {
                    if (topicTree[key].subtopics[key2].locked) {
                      setError("This subtopic is locked.");
                      return;
                    }
                    navigate('/learn/' + key.replaceAll(' ', '-') + '/' + key2.replaceAll(' ', '-'), {});
                  }}>
                    <ListItemIcon>
                      {subtopicIcon(topicTree[key].subtopics[key2])}
                    </ListItemIcon>
                    <ListItemText primary={topicTree[key].subtopics[key2].name} />
                  </ListItemButton>
                )}
              </List>
            </Collapse>
          </>

        ))}
      </List>

    </Box>
  );

  const [shouldBeOpen, setShouldBeOpen] = React.useState<boolean>(true); // sinful hack
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShouldBeOpen(true), 0);
    } else {
      setTimeout(() => setShouldBeOpen(false), 200);
    }
  }, [isOpen, ]); // forgive me ):

  return (
    <div id={location.toString()}>
      <React.Fragment key={'left'}>
        {/* <Button onClick={toggleDrawer('left', true)}>{'left'}</Button> */}
        {!shouldBeOpen && <IconButton className="borgir" onClick={toggleDrawer('left', true)} sx={{ position: "fixed", top: '1rem', left: '1rem', zIndex: 2000 }}><MenuIcon /></IconButton>}
        <Drawer
          anchor={'left'}
          open={isOpen && !error}
          onClose={toggleDrawer('left', false)}
        >
          {list('left')}
        </Drawer>
      </React.Fragment>

      <Modal show={error !== ""} onHide={() => setError("")}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error.replace("Error: ", "").replace("Firebase: ", "").trim()}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setError("")}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
    </div>
  );
}
