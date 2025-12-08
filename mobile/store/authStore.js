import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const useAuthStore = create((set,get) => ({
    user:null,
    token:null,
    isLoading: false,
    isCheckingAuth: true,

   register: async(username,email,password)=>{
    set({isLoading:true});
    try {
        const response = await fetch('https://bookworm-1-tmgl.onrender.com/api/auth/register',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({username,email,password})
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        await AsyncStorage.setItem('token', data.token);

        set({token:data.token,user:data.user,isLoading:false});

        return {success:true};
        
    } catch (error) {
        set({isLoading:false});
        return {success:false,message:error.message};
    }

   },

   checkAuth: async()=>{
   try {
    const token = await AsyncStorage.getItem('token');
    const userJson = await AsyncStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    set({token,user});
    
   } catch (error) {
    console.log("Auth checking failed:",error);
   }finally{
    set({isCheckingAuth:false});
   }
  },

  login: async(email,password)=>{
    set({isLoading:true});
    try {
        const response = await fetch('https://bookworm-1-tmgl.onrender.com/api/auth/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({email,password})
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        await AsyncStorage.setItem('token', data.token);
        set({token:data.token,user:data.user,isLoading:false});

        return {success:true};
    } catch (error) {
        return {success:false,message:error.message};
    }
},
  
  logout: async()=>{
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    set({token:null,user:null});
  }
    
    
}));