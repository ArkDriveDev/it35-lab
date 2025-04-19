import { useState, useEffect, useRef } from 'react';
import { IonApp, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonInput, IonLabel, IonModal, IonFooter, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonAlert, IonText, IonAvatar, IonCol, IonGrid, IonRow, IonIcon, IonPopover } from '@ionic/react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supaBaseClient';
import { pencil, camera, happyOutline } from 'ionicons/icons';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

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
  const createFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editPostImageFile, setEditPostImageFile] = useState<File | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [popoverState, setPopoverState] = useState<{ open: boolean; event: Event | null; postId: string | null }>({ open: false, event: null, postId: null });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editPostContent, setEditPostContent] = useState('');

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

  // Modify your addEmoji function to close the picker
  const addEmoji = (emoji: any) => {
    if (emoji && emoji.native) {
      setPostContent(prevContent => prevContent + emoji.native);
      setShowEmojiPicker(false);
    }
  };

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
    setImagePreview(null);
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
    setEditPostContent(post.post_content); // Use editPostContent instead of postContent
    setEditImagePreview(null);
    setEditPostImageFile(null);
    setIsModalOpen(true);
  };

  const savePost = async () => {
    if (!editPostContent || !editingPost) return;

    let newImageUrl = editingPost.post_image_url;

    // Image upload logic remains the same...
    if (editPostImageFile) {
      // ... existing image upload code ...
    }

    // Delete old image if needed
    if (editingPost.post_image_url) {
      // ... existing image deletion code ...
    }

    // Update post in database - THIS IS THE CRUCIAL FIX:
    const { data, error: dbError } = await supabase
      .from('posts')
      .update({
        post_content: editPostContent,  // ← Changed from postContent to editPostContent
        post_image_url: newImageUrl,
        post_updated_at: new Date().toISOString()
      })
      .match({ post_id: editingPost.post_id })
      .select('*');

    if (!dbError && data) {
      const updatedPost = data[0] as Post;
      setPosts(posts.map(post =>
        post.post_id === updatedPost.post_id ? updatedPost : post
      ));
      // Reset all edit-related states
      setEditPostContent('');
      setEditingPost(null);
      setEditPostImageFile(null);
      setEditImagePreview(null);
      setIsModalOpen(false);
      setIsAlertOpen(true);
    } else {
      console.error('Post update failed:', dbError?.message);
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
                    onIonChange={(e) => setPostContent(e.detail.value!)}
                    placeholder="Write a post..."
                    style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}
                  />

                  <div style={{ marginTop: '1rem' }}>
                    {/* Hidden input field */}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      ref={createFileInputRef}
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

                    <IonIcon
                      icon={camera}
                      style={{ fontSize: '32px', cursor: 'pointer' }}
                      onClick={() => createFileInputRef.current?.click()}
                    />
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <IonIcon
                        icon={happyOutline}
                        style={{ fontSize: '32px', cursor: 'pointer', marginLeft: '10px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowEmojiPicker(!showEmojiPicker);
                        }}
                      />

                      {showEmojiPicker && (
                        <div style={{
                          position: 'absolute',
                          zIndex: 200,
                          bottom: '380%',
                          left: 0,
                          marginBottom: '1px',
                          height: '20%'
                        }}>
                          <Picker
                            data={data}
                            onEmojiSelect={addEmoji}
                            onClickOutside={() => setShowEmojiPicker(false)}
                          />
                        </div>
                      )}
                    </div>

                    {/* Image preview */}
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
                        style={{ width: '10%', height: '5%', borderRadius: '10px', marginTop: '10px' }}
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

        <IonModal isOpen={isModalOpen}  onDidDismiss={() => {
          setIsModalOpen(false);
          setEditPostContent('');
          setEditImagePreview(null);
          setEditPostImageFile(null);
        }}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Edit Post</IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            <IonInput
              value={editPostContent} // Use editPostContent here
              onIonChange={(e) => setEditPostContent(e.detail.value!)}
              placeholder="Edit your post..."
            />

            {(editImagePreview || editingPost?.post_image_url) && (
              <div style={{
                position: 'relative',
                marginTop: '1rem',
                display: 'inline-block' // This makes the container fit the image size
              }}>
                <img
                  src={editImagePreview || editingPost?.post_image_url}
                  alt="Preview"
                  style={{
                    width: '100%',
                    maxWidth: '400px', // Adjust as needed
                    borderRadius: '8px',
                    display: 'block' // Removes extra space below image
                  }}
                />

                {/* Camera icon positioned absolutely over the image */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: '50%',
                  padding: '5px'
                }}>
                  <IonIcon
                    icon={camera}
                    style={{
                      fontSize: '24px',
                      cursor: 'pointer',
                      color: 'white'
                    }}
                    onClick={() => editFileInputRef.current?.click()}
                  />
                </div>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              ref={editFileInputRef}
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                setEditPostImageFile(file ?? null);
                if (file) {
                  setEditImagePreview(URL.createObjectURL(file));
                }
              }}
            />

            {/* Fallback camera icon when no image exists */}
            {!(editImagePreview || editingPost?.post_image_url) && (
              <IonIcon
                icon={camera}
                style={{ fontSize: '32px', cursor: 'pointer', marginTop: '1rem' }}
                onClick={() => editFileInputRef.current?.click()}
              />
            )}
          </IonContent>

          <IonFooter className="ion-padding">
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