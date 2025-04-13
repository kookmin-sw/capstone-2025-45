// utils/simpleVoting.js
import { db } from "../firebase";
import { doc, getDoc, getDocs, updateDoc, collection, addDoc, query, orderBy, limit } from "firebase/firestore";

export const getSimpleProjectById = async (projectId) => {
  const ref = doc(db, "simpleProjects", projectId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const incrementSimpleVote = async (projectId) => {
  const ref = doc(db, "simpleProjects", projectId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const current = snap.data().votes || 0;
    await updateDoc(ref, { votes: current + 1 });
  }
};

export const logSimpleVote = async (projectId) => {
  const ref = collection(db, "simpleVotes");
  await addDoc(ref, {
    projectId,
    timestamp: Date.now()
  });
};

export const getAllSimpleProjects = async () => {
  const querySnapshot = await getDocs(collection(db, "simpleProjects"));
  console.log(querySnapshot)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));

  
};

export const getTopSimpleProjects = async () => {
  const projectsRef = collection(db, "simpleProjects");
  const q = query(projectsRef, orderBy("votes", "desc"), limit(5));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
};

