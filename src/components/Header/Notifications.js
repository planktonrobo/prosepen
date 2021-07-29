import { BsHeart } from "react-icons/bs";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { useCollection } from "react-firebase-hooks/firestore";
import useNotifs from "../../hooks/use-notifs";
import { Link } from "react-router-dom";
import slugify from "react-slugify";
import { formatDistance } from "date-fns";
const Notifications = ({ firebase, userId }) => {
  const [value, loading, error] = useCollection(
    firebase
      .firestore()
      .collection("notifications")
      .where("to", "==", userId)
      .orderBy("dateNoted", "desc")
      .limit(25),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const { notifs } = useNotifs(value && value);

  async function handleRead() {
    if (notifs) {
      const batch = await firebase.firestore().batch();
      await notifs.map(async (notif) => {
        const collectionRef = await firebase
          .firestore()
          .collection("notifications")
          .doc(notif.notifDocId);
        batch.update(collectionRef, { read: true });
      });
      return await setTimeout(() => {
        batch.commit();
      }, 1000);
    }
  }
  const newnotifs = notifs?.filter((obj) => obj.read === false).length;
  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom-end"
      rootClose={true}
      onEnter={() => handleRead()}
      style={{ positon: "static" }}
      overlay={
        <Popover
          style={{ overflowY: "auto", maxHeight: 500 }}
          id={`popover-positioned-bottom`}
        >
          <Popover.Title as="h3">Notifications</Popover.Title>
          <Popover.Content className="p-0"></Popover.Content>
          {notifs?.length > 0 ? (
            notifs.map((notif, i) => (
              <div key={i} className={`media p-2 ${!notif.read && "new"}`}>
                <Link to={`/p/${notif.username}`}>
                  <img
                    src={notif.picture}
                    alt={notif.username}
                    style={{ width: 24 }}
                    className="mr-2 rounded-circle"
                  />
                </Link>
                <div className="media-body border-bottom border-gray">
                  <div className="pb-2">
                    <span>
                      <Link className="text-dark " to={`/p/${notif.username}`}>
                        <strong>@{notif.username}</strong>
                      </Link>
                      {notif.type === "like"
                        ? " liked your piece "
                        : notif.type === "comment"
                        ? " commented on your piece "
                        : " followed you"}
                      {notif.type !== "follow" ? (
                        <Link
                          to={`/${notif.username}/${slugify(notif.title)}/${
                            notif.pieceId
                          }`}
                          className="text-dark"
                        >
                          <strong>{notif.title}</strong>
                        </Link>
                      ) : null}
                      {
                        <span className="small mx-1 text-muted">
                          ·{" "}
                          {notif?.dateNoted &&
                            formatDistance(
                              notif.dateNoted.seconds * 1000,
                              Date.now()
                            )}{" "}
                          ago
                        </span>
                      }
                      {notif.comment && (
                        <span className="small text-muted">
                          <br />"{notif.comment}"
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-2 text-center" style={{ width: 250 }}>
              Nothing here yet! Get writing ❤️
            </div>
          )}
        </Popover>
      }
    >
      <div
        className="d-flex align-items-center py-0 mx-2"
        style={{ width: 32, cursor: "pointer" }}
      >
        <h4>
          <BsHeart />
        </h4>
        <span
          className="badge badge-dark"
          style={{
            zIndex: "18",
            float: "right",
            marginBottom: "5px",
            right: "8px",
            top: "-8px",
            position: "relative",
            fontSize: 12,
          }}
        >
          {newnotifs > 0 ? newnotifs : newnotifs > 24 ? "25+" : null}
        </span>
      </div>
    </OverlayTrigger>
  );
};

export default Notifications;
