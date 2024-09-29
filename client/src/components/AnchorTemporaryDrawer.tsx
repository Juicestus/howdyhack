import React from "react";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
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
import { ListGroup } from "react-bootstrap";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";


type Anchor = 'left';

export function AnchorTemporaryDrawer() {

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

  const sortfn = (a: string, b: string) => {
    return parseFloat(a.split(' ')[0]) - parseFloat(b.split(' ')[0]); // danger ):
  }

  const topicIcon = (t: Topic) => {
    let allLocked = true;
    let allCompleted = false;
    for (const key in t.subtopics) {
      if (!t.subtopics[key].locked) {
        allLocked = false;
        break;
      }
      if (t.subtopics[key].completed) {
        allLocked = true;
        break;
      }
    }
    if (allLocked) {
      return <LockIcon />;
    }
    if (allCompleted) {
      return <CheckCircleOutlineIcon />;
    }
    return <AccessTimeIcon />;
  }

  const subtopicIcon = (t: Subtopic) => {
    if (t.locked) {
      return <LockIcon />;
    }
    if (t.completed) {
      return <CheckCircleOutlineIcon />;
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
      sx={{ width: 250 }}
      role="presentation"
      // onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >

      <List>
        {/* <ListGroup> */}
          <ListItem>
            <Avatar alt="Remy Sharp" src={profilPicSrc()} className="mr-4"/>
            <ListItemText primary={user?.displayName?.split(' ')[0] || "Ol Rock"} />
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
                      alert("This subtopic is locked.");
                      return;
                    }
                    navigate('/learn/' + key.replaceAll(' ', '-') + '/' + key2.replaceAll(' ', '-'));
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

  return (
    <div>
      <React.Fragment key={'left'}>
        {/* <Button onClick={toggleDrawer('left', true)}>{'left'}</Button> */}
        {!isOpen && <IconButton onClick={toggleDrawer('left', true)} sx={{ position: "fixed", top: 0, left: 0, zIndex: 2000 }}><MenuIcon /></IconButton>}
        <Drawer
          anchor={'left'}
          open={isOpen}
          onClose={toggleDrawer('left', false)}
        >
          {list('left')}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
