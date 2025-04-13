// utils/firebaseProff.js
import { db } from "../firebase";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";

// 전체 교수 리스트 가져오기
export const getAllProfessors = async () => {
  const snapshot = await getDocs(collection(db, "professors"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
};

// 특정 교수 가져오기
export const getProfessorById = async (profId) => {
  const ref = doc(db, "professors", profId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};