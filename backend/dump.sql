PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    priority TEXT NOT NULL,
    due_date TEXT,
    created_at TEXT,
    updated_at TEXT
);
INSERT INTO tasks VALUES('385da757-0609-4244-bbb8-d36bd406a637','Finish backend API','in_progress','high','2026-04-02','2026-03-29T20:09:03.034Z','2026-03-31T02:23:46.894Z');
INSERT INTO tasks VALUES('c2941422-946c-4d8f-9b9e-45a28b02d332','Write API documentation','in_progress','medium','2026-04-03','2026-03-29T20:09:11.485Z','2026-03-31T01:20:53.743Z');
INSERT INTO tasks VALUES('f3fcb483-40c2-4427-826e-853fed0784f5','Design database schema','pending','high','2026-04-10','2026-03-29T20:09:52.118Z',NULL);
INSERT INTO tasks VALUES('b6fbcd97-c0e6-44ac-8e93-dac9612fb657','Fix authentication bug','in_progress','high','2026-04-05','2026-03-29T20:42:49.094Z','2026-03-30T15:19:02.195Z');
INSERT INTO tasks VALUES('a713b3e0-db53-4659-bec4-0b4b0dd7532b','Refactor service layer','pending','medium','2026-04-08','2026-03-29T20:42:51.203Z',NULL);
INSERT INTO tasks VALUES('707f0e3f-1bbf-4c59-9165-c3724356980c','Update README file','pending','low','2026-03-31','2026-03-31T00:13:39.820Z',NULL);
INSERT INTO tasks VALUES('ec58072a-51aa-4c20-9f77-2dedef447d49','Test API endpoints','done','medium','2026-03-31','2026-03-31T00:13:53.116Z','2026-03-31T03:10:12.000Z');
INSERT INTO tasks VALUES('3db5d3d8-65e6-4b82-a09d-92ef554e0dcf','Implement error handling','pending','high','2026-04-04','2026-03-31T00:15:22.864Z',NULL);
INSERT INTO tasks VALUES('d296a2a9-b2a2-4e15-95a7-8817d772edba','Optimize database queries','in_progress','medium','2026-04-06','2026-03-31T00:17:06.591Z','2026-03-31T04:45:00.000Z');
INSERT INTO tasks VALUES('7dc58a5c-9a7f-4552-8742-a684312a7573','Add logging system','pending','low','2026-04-07','2026-03-31T00:17:35.807Z',NULL);
INSERT INTO tasks VALUES('75359b61-fbf5-4062-b085-aadc8db2fadb','Deploy app to server','done','high','2026-04-01','2026-03-31T01:27:31.000Z','2026-03-31T06:00:00.000Z');
INSERT INTO tasks VALUES('75739b61-fbf5-4062-b085-aa3c8ds2fadb','Do pending tasks','pending','high','2026-03-29','2026-03-28T01:27:31.000Z',NULL);
COMMIT;
