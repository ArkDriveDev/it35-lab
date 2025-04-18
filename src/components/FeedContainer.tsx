import { useState, useEffect } from 'react';
import { IonApp, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonInput, IonLabel, IonModal, IonFooter, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonAlert, IonText, IonAvatar, IonCol, IonGrid, IonRow, IonIcon, IonPopover } from '@ionic/react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supaBaseClient';
import { colorFill, pencil, trash } from 'ionicons/icons';

interface Post {
  post_id: string;
  user_id: number;
  username: string;
  avatar_url: string;
  post_content: string;
  post_created_at: string;
  post_updated_at: string;
  post_image_url?: string;
}

const FeedContainer = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [popoverState, setPopoverState] = useState<{ open: boolean; event: Event | null; postId: string | null }>({ open: false, event: null, postId: null });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.email?.endsWith('@nbsc.edu.ph')) {
        setUser(authData.user);
        const { data: userData, error } = await supabase
          .from('users')
          .select('user_id, username, user_avatar_url')
          .eq('user_email', authData.user.email)
          .single();
        if (!error && userData) {
          setUser({ ...authData.user, id: userData.user_id });
          setUsername(userData.username);
        }
      }
    };
    const fetchPosts = async () => {
      const { data, error } = await supabase.from('posts').select('*').order('post_created_at', { ascending: false });
      if (!error) setPosts(data as Post[]);
    };
    fetchUser();
    fetchPosts();
  }, []);

  const createPost = async () => {
    if (!postContent || !user || !username) return;
  
    // Fetch avatar
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('user_avatar_url')
      .eq('user_id', user.id)
      .single();
  
    if (userError) {
      console.error('Error fetching avatar:', userError);
      return;
    }
  
    const avatarUrl = userData?.user_avatar_url || 'https://ionicframework.com/docs/img/demos/avatar.svg';
  
    let postImageUrl = '';
  
    // Upload image if exists
    if (postImageFile) {
      const fileExt = postImageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `post-images/${user.id}/${fileName}`;
  
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, postImageFile);
  
      if (uploadError) {
        console.error('Image upload error:', uploadError); // Log the error details
        alert(`Error uploading image: ${uploadError.message}`); // Provide feedback to the user
      } else {
        postImageUrl = supabase.storage.from('post-images').getPublicUrl(filePath).data.publicUrl;
      }
    }
  
    // Insert post
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          post_content: postContent,
          user_id: user.id,
          username,
          avatar_url: avatarUrl,
          post_image_url: postImageUrl,
        }
      ])
      .select('*');
  
    if (!error && data) {
      setPosts([data[0] as Post, ...posts]);
    }
  
    // Reset fields
    setPostContent('');
    setPostImageFile(null);
  };  
  
  const getImagePath = (url: string) => {
    const match = url.match(/post-images\/(.+)/);
    return match ? match[1] : null;
  };

  const deletePost = async (post_id: string, imagePath?: string | null) => {
    console.log('Deleting post:', post_id);
    console.log('Image path to delete:', imagePath);
  
    // Delete post data from 'posts' table
    const { error: deletePostError } = await supabase
      .from('posts')
      .delete()
      .match({ post_id });
    if (deletePostError) {
      console.error('Error deleting post:', deletePostError);
      return;
    }
  
    // If there is an image path, delete the image from storage
    if (imagePath) {
      console.log('Attempting to delete image at:', imagePath);
      const { data: deleteData, error: deleteImageError } = await supabase
      .storage
      .from('post-images')
      .remove([imagePath]); // This is the path inside the bucket
    
      if (deleteImageError) {
        console.error('Error deleting image:', deleteImageError.message);
       } else {
          console.log('Image deleted successfully:', deleteData);
      }
    }
  
    // Update state after deleting post
    setPosts(posts.filter(post => post.post_id !== post_id));
  };
  
  const startEditingPost = (post: Post) => {
    setEditingPost(post);
    setPostContent(post.post_content);
    setIsModalOpen(true);
  };

  const savePost = async () => {
    if (!postContent || !editingPost) return;
    const { data, error } = await supabase
      .from('posts')
      .update({ post_content: postContent })
      .match({ post_id: editingPost.post_id })
      .select('*');
    if (!error && data) {
      const updatedPost = data[0] as Post;
      setPosts(posts.map(post => (post.post_id === updatedPost.post_id ? updatedPost : post)));
      setPostContent('');
      setEditingPost(null);
      setIsModalOpen(false);
      setIsAlertOpen(true);
    }
  };

  return (
    <IonApp>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Posts</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {user ? (
            <>
            <IonCard>
                <IonCardHeader>
                    <IonCardTitle>Create Post</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
    <IonInput 
      value={postContent} 
      onIonChange={e => setPostContent(e.detail.value!)} 
      placeholder="Write a post..." 
    />

    <div style={{ marginTop: '1rem' }}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          setPostImageFile(file ?? null);
          if (file) {
            setImagePreview(URL.createObjectURL(file));
          } else {
            setImagePreview(null);
          }
        }}
      />

      {imagePreview && (
        <div style={{ marginTop: '1rem' }}>
          <img 
            src={imagePreview} 
            alt="Preview" 
            style={{ width: '10%', borderRadius: '8px' }} 
          />
        </div>
      )}
    </div>
  </IonCardContent>

  <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.5rem' }}>
    <IonButton onClick={createPost}>Post</IonButton>
  </div>
            </IonCard>

              {posts.map(post => (
                <IonCard key={post.post_id} style={{ marginTop: '2rem' }}>
                <IonCardHeader>
                  <IonRow>
                    <IonCol size="1.85">
                      <IonAvatar>
                        <img alt={post.username} src={post.avatar_url} />
                      </IonAvatar>
                    </IonCol>
                    <IonCol>
                      <IonCardTitle style={{ marginTop: '10px' }}>{post.username}</IonCardTitle>
                      <IonCardSubtitle>{new Date(post.post_created_at).toLocaleString()}</IonCardSubtitle>
                    </IonCol>
                    <IonCol size="auto">
                      {/* Pencil icon triggers popover */}
                      <IonButton
                        fill="clear"
                        onClick={(e) => setPopoverState({ open: true, event: e.nativeEvent, postId: post.post_id })}
                      >
                        <IonIcon color="secondary" icon={pencil} />
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonCardHeader>
              
                <IonCardContent>
                  <IonText style={{ color: 'black' }}>
                    <h1>{post.post_content}</h1>
                  </IonText>

                    {post.post_image_url && (
                    <img
                    src={post.post_image_url}
                    alt="Post"
                    style={{ width: '10%', height:'5%', borderRadius: '10px', marginTop: '10px' }}
                  />
                   )}
              </IonCardContent>

                {/* Popover with Edit and Delete options */}
                <IonPopover
                  isOpen={popoverState.open && popoverState.postId === post.post_id}
                  event={popoverState.event}
                  onDidDismiss={() => setPopoverState({ open: false, event: null, postId: null })}
                >
                  <IonButton fill="clear" onClick={() => { startEditingPost(post); setPopoverState({ open: false, event: null, postId: null }); }}>
                    Edit
                  </IonButton>
                  <IonButton
                    fill="clear"
                    color="danger"
                    onClick={() => {
                    const imagePath = getImagePath(post.post_image_url ?? ''); 
                    deletePost(post.post_id, imagePath);
                    setPopoverState({ open: false, event: null, postId: null });
                    }}>Delete
                  </IonButton>

                </IonPopover>
              </IonCard>
              ))}
            </>
          ) : (
            <IonLabel>Loading...</IonLabel>
          )}
        </IonContent>

        <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Edit Post</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonInput value={postContent} onIonChange={e => setPostContent(e.detail.value!)} placeholder="Edit your post..." />
          </IonContent>
          <IonFooter>
            <IonButton onClick={savePost}>Save</IonButton>
            <IonButton onClick={() => setIsModalOpen(false)}>Cancel</IonButton>
          </IonFooter>
        </IonModal>

        <IonAlert
          isOpen={isAlertOpen}
          onDidDismiss={() => setIsAlertOpen(false)}
          header="Success"
          message="Post updated successfully!"
          buttons={['OK']}
        />
      </IonPage>
    </IonApp>
  );
};

export default FeedContainer;